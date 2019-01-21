export interface Column {
  name: string;
  stats: {
    isNumeric: boolean;
    min: number;
    max: number;
    avg: number;
  },
  chart: {
    [key: string]: number
  }
}

export interface Dataset {
  id: number;
  filename: string;
  size: number;
  created: number;
  columns: Column[]
}
