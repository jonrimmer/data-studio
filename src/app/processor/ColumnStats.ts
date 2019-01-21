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
  constructor(public index: number) { }
  toString() {
    return `Column ${this.index}: Min(${this.min}), Max(${this.max}), Avg(${this.avg}, Unq(${this.uniqueValues}))`;
  }
}
