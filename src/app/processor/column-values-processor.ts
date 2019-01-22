import { Processor } from './processor';
import { ColumnValuesCounter } from './column-values-counter';
import { ColumnStats } from './column-stats';
import { ColumnValues } from '../datasets/model/dataset';

/**
 * CSV processor for building per-column chart/histogram data.
 * 
 * Alphanumeric values are recorded as discrete categories. Numeric values are recorded as separately 
 * if there number of unique values is low, otherwise they are collected into a histogram of 20 evenly
 * sized bins between the min and max value found in the column.
 */
export class ColumnValuesProcessor implements Processor<ColumnValues[]> {
  columns: ColumnValuesCounter[];

  constructor(stats: ColumnStats[]) {
    this.columns = stats.map(stats => new ColumnValuesCounter(stats));
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

  row(_row: any[]): void { }

  finished(): ColumnValues[] {
    return this.columns.map(column => ({
      continuous: column.bins,
      categorical: Array.from(Object.entries(column.categories)).map(([value, frequency]) => ({
        value,
        frequency
      }))
    }));
  }
}
