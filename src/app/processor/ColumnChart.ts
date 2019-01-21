import { ColumnStats } from './ColumnStats';
import { NumericStrategy, Chart } from './ChartAndHistogramProcessor';

export function categoryName(value: string = '[blank]') {
  return value === '' ? '[blank]' : value;
}

export class ColumnChart {
  categories: {
    [key: string]: number;
  } = {};
  chartAlphanumeric: boolean;
  numericStrategy: NumericStrategy;
  bins: Chart = [];
  range = 0;
  
  constructor(private column: ColumnStats) {
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
        };
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
