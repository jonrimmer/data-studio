import { Processor } from './processor';
import { Uniques } from './uniques';
import { ColumnStats } from './column-stats';
import { UNIQUE_COUNT_LIMIT } from './chart-constants';

export class StatsProcessor implements Processor<ColumnStats[]> {
  columns: ColumnStats[];
  private uniques: Uniques[];
  private total = 0;

  constructor(columnCount: number) {
    this.columns = Array.from({ length: columnCount }, (_, i) => new ColumnStats(i));
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
      column.avg /= this.total;
      column.uniqueValues = {
        alphanumeric: this.uniques[i].alphanumeric.size,
        numeric: this.uniques[i].numeric.size,
        exceededLimit: this.uniques[i].size >= UNIQUE_COUNT_LIMIT
      };
    });

    return this.columns;
  }

  toString() {
    return this.columns.map(c => c.toString()).join('\n');
  }
}
