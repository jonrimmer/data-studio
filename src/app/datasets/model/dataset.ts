import { ColumnChart } from './chart';

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
  chart: ColumnChart
}

export interface Dataset {
  id: number;
  filename: string;
  size: number;
  created: number;
  columns: Column[]
}
