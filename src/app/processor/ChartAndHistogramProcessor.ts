import { Processor } from './processor';
import { ColumnChart } from "./ColumnChart";
import { ColumnStats } from "./ColumnStats";

export enum NumericStrategy {
  BIN = 0,
  CHART = 1
};

export type Chart = {
  label: string;
  value: number;
}[];

export class ChartAndHistogramProcessor implements Processor<Chart[]> {
  columns: ColumnChart[];

  constructor(stats: ColumnStats[]) {
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

  row(_row: any[]): void { }

  finished(): Chart[] {
    return this.columns.map(column => column.bins.concat(Array.from(Object.entries(column.categories)).map(entry => ({
      label: entry[0],
      value: entry[1]
    }))));
  }
}
