import { parse } from 'papaparse';
import { Observable } from 'rxjs';

interface ProcessConfg {
  hasHeader: boolean;
  columns: number[];
}

interface Processor<T> {
  value(field: number, value: any): void;
  row(row: any[]): void;
  finished(): T;
}

export function processCsvFile<T>(
  file: File | string,
  { hasHeader, columns }: ProcessConfg,
  processor: Processor<T>
): Observable<T> {
  return new Observable(subscriber => {
    let chunk = 0;
    const result: any[] = [];

    parse(file as any /* TS complains otherwise, see #14107 */, {
      chunk: results => {
        let start = 0;
        let rowsToProcess = results.data.length;
  
        if (chunk == 0 && hasHeader) {
          // Skip the header.
          start = 1;
        }
  
        for (let i = start; i < rowsToProcess; i++) {
          const row = results.data[i];
          processor.row(row);
  
          for (let f = 0; f < columns.length; f++) {
            const c = columns[f];
            const value = row[c];
            processor.value(f, value);
          }
        }
      },
      complete: () => {
        subscriber.next(processor.finished());
        subscriber.complete();
      },
      skipEmptyLines: true
    });
  });
}

export class ColumnStats {
  min = Number.POSITIVE_INFINITY;
  max = Number.NEGATIVE_INFINITY;
  avg = 0;
  isNumeric = true;
  isAlphanumeric = true;
  uniqueValues = {
    numeric: 0,
    alphanumeric: 0,
    exceededLimit: false
  };

  constructor(public index: number) {}

  toString() {
    return `Column ${ this.index }: Min(${ this.min}), Max(${ this.max }), Avg(${ this.avg }, Unq(${ this.uniqueValues }))`;
  }
}

export const UNIQUE_COUNT_LIMIT = 1000;

class Uniques {
  numeric = new Set<string>();
  alphanumeric = new Set<string>();

  get size() {
    return this.numeric.size + this.alphanumeric.size;
  }

  add(value: string, isNumeric: boolean) {
    if (this.size < UNIQUE_COUNT_LIMIT) {
      (isNumeric ? this.numeric : this.alphanumeric).add(value);
    }
  }
}

export class StatsProcessor implements Processor<ColumnStats[]> {
  columns: ColumnStats[];

  private uniques: Uniques[];

  private total = 0;

  constructor(columnCount: number) {
    this.columns = Array.from({ length: columnCount}, (_, i) => new ColumnStats(i));
    this.uniques = Array.from({ length: columnCount }, () => new Uniques());
  }

  value(field: number, value: any): void {
    const column = this.columns[field];
    const numValue = Number.parseFloat(value);
    const isNumeric = !Number.isNaN(numValue);

    if (isNumeric) {
      column.min = Math.min(column.min, numValue);
      column.max = Math.max(column.max, numValue);
      column.avg += numValue;
      column.isAlphanumeric = false;
    }
    else {
      column.isNumeric = false;
    }

    this.uniques[field].add(value, isNumeric);
  }

  row(_: any[]): void {
    this.total++;
  }

  finished(): ColumnStats[] {
    this.columns.forEach((column, i) => {
      column.avg /= this.total
      column.uniqueValues = {
        alphanumeric: this.uniques[i].alphanumeric.size,
        numeric: this.uniques[i].numeric.size,
        exceededLimit: this.uniques[i].size >= UNIQUE_COUNT_LIMIT
      }
    });

    return this.columns;
  }

  toString() {
    return this.columns.map(c => c.toString()).join('\n');
  }
}

enum NumericStrategy {
  BIN = 0,
  CHART = 1
};

const MAX_CHART_SIZE = 50;

function categoryName(value: string = '[blank]') {
  return value === '' ? '[blank]' : value;
}

export type Chart = {
  label: string;
  value: number;
}[];

class ColumnChart {
  categories: {
    [key: string]: number
  } = {};
  chartAlphanumeric: boolean;
  numericStrategy: NumericStrategy;
  bins: Chart = [];
  range = 0;

  constructor(
    private column: ColumnStats
  ) {
    this.chartAlphanumeric = column.uniqueValues.alphanumeric <= 200;
    this.numericStrategy = column.uniqueValues.numeric < 20 ? NumericStrategy.CHART : NumericStrategy.BIN;

    if (this.numericStrategy === NumericStrategy.BIN) {
      this.range = column.max - column.min;
      
      this.bins = Array.from({ length: 20 }, (_, i) => {
        const binLowerBound = column.min + (i * (this.range / 20));
        const binUpperBound = column.min + ((i + 1) * (this.range / 20));
        return {
          label: Math.round(binLowerBound) + ' - ' + Math.round(binUpperBound),
          value: 0
        }
      });
    }
  }

  addNumeric(value: number) {
    if (this.numericStrategy === NumericStrategy.BIN) {
      let binIndex = Math.floor(((value - this.column.min) / this.range) * 20);

      if (binIndex === 20) {
        binIndex = 19;
      }

      this.bins[binIndex].value += 1;
    }
    else {
      let name = value.toString();
      this.categories[name] = (this.categories[name] || 0) + 1;
    }
  }

  addAlphanumeric(value: string) {
    value = categoryName(value);
    this.categories[value] = (this.categories[value] || 0) + 1;
  }
}

export class ChartAndHistogramProcessor implements Processor<Chart[]> {
  columns: ColumnChart[];

  constructor(private stats: ColumnStats[]) {
    this.columns = stats.map(stats => new ColumnChart(stats));
  }

  value(field: number, value: any): void {
    let numValue = Number.parseFloat(value);

    if (!Number.isNaN(numValue)) {
      this.columns[field].addNumeric(numValue);
    }
    else {
      this.columns[field].addAlphanumeric(value);
    }
  }
  
  row(row: any[]): void {}

  finished(): Chart[] {
    return this.columns.map(column => 
      column.bins.concat(Array.from(Object.entries(column.categories)).map(entry => ({
        label: entry[0],
        value: entry[1]
      })))
    );
  }
}
