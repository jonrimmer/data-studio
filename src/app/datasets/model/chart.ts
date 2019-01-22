export type CategoricalChart = {
  label: string;
  value: number;
}[];

export type ContinuousChart = {
  lowerBound: number;
  upperBound: number;
  value: number;
}[];

export interface ColumnChart {
  categorical: CategoricalChart;
  continuous: ContinuousChart;
}
