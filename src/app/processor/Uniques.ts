import { UNIQUE_COUNT_LIMIT } from './StatsProcessor';

export class Uniques {
  numeric = new Set<string>();
  alphanumeric = new Set<string>();
  
  get size() {
    return this.numeric.size + this.alphanumeric.size;
  }

  add(value: string, isNumeric: boolean) {
    if (this.size < UNIQUE_COUNT_LIMIT) {
      (isNumeric ? this.numeric : this.alphanumeric).add(value);
    }
  }
}
