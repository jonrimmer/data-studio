import { parse } from 'papaparse';
import { Observable } from 'rxjs';

interface ProcessConfg {
  hasHeader: boolean;
  columns: number[];
}

export interface Processor<T> {
  value(field: number, value: any): void;
  row(row: any[]): void;
  finished(): T;
}

export function processCsvFile<T>(
  file: File | string,
  { hasHeader, columns }: ProcessConfg,
  processor: Processor<T>
): Observable<T> {
  return new Observable(subscriber => {
    let chunk = 0;

    parse(file as any /* TS complains otherwise, see #14107 */, {
      // Process in streaming mode so we can handle very large files.
      chunk: results => {
        let start = 0;
        let rowsToProcess = results.data.length;
  
        if (chunk == 0 && hasHeader) {
          // Skip the header.
          start = 1;
        }
  
        for (let i = start; i < rowsToProcess; i++) {
          const row = results.data[i];
          processor.row(row);
  
          for (let f = 0; f < columns.length; f++) {
            const c = columns[f];
            const value = row[c];
            processor.value(f, value);
          }
        }
      },
      complete: () => {
        subscriber.next(processor.finished());
        subscriber.complete();
      },
      skipEmptyLines: true
    });
  });
}
