export enum ColumnType {
  Alphanumeric = 'Alphanumeric',
  Numeric = 'Numeric',
  Mixed = 'Mixed'
}

export interface Column {
  name: string;
  type: ColumnType;
  stats: {
    min: number;
    max: number;
    avg: number;
    uniqueCount: number;
    exceededUniqueLimit: boolean;
  };  
  values: ColumnValues
}

export interface Dataset {
  id: number;
  filename: string;
  size: number;
  created: number;
  columns: Column[]
}

export type CategoricalValues = {
  value: string;
  frequency: number;
}[];

export type ContinuousValues = {
  lowerBound: number;
  upperBound: number;
  frequency: number;
}[];

export interface ColumnValues {
  categorical: CategoricalValues;
  continuous: ContinuousValues;
}
