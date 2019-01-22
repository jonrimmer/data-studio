import { Processor } from './processor';
import { ColumnValueCounter } from "./ColumnValueCounter";
import { ColumnStats } from "./ColumnStats";
import { ColumnChart } from '../datasets/model/chart';

/**
 * CSV processor for building per-column chart/histogram data.
 * 
 * Alphanumeric values are recorded as discrete categories. Numeric values are recorded as separately 
 * if there number of unique values is low, otherwise they are collected into a histogram of 20 evenly
 * sized bins between the min and max value found in the column.
 */
export class ChartAndHistogramProcessor implements Processor<ColumnChart[]> {
  columns: ColumnValueCounter[];

  constructor(stats: ColumnStats[]) {
    this.columns = stats.map(stats => new ColumnValueCounter(stats));
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

  finished(): ColumnChart[] {
    return this.columns.map(column => ({
      continuous: column.bins,
      categorical: Array.from(Object.entries(column.categories)).map(([key, value]) => ({
        label: key,
        value
      }))
    }));
  }
}
