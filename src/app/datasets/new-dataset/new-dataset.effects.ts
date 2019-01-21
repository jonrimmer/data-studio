import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NewDatasetActionTypes, LoadFileError, FileChosen, NewDatasetAction, FilePreviewed, CreateDataset } from './new-dataset.actions';
import { switchMap, mergeMap, withLatestFrom, filter, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { parse } from 'papaparse';
import { AppState } from 'src/app/reducers';
import { Store } from '@ngrx/store';
import { getFile, getColumns } from './new-dataset.selectors';
import { processCsvFile, StatsProcessor, ChartAndHistogramProcessor, ColumnStats } from 'src/app/processor/processor';
import { DatasetSaved } from '../datasets.actions';
import { ColumnType } from '../model/dataset';

function getColumnType(stats: ColumnStats): ColumnType {
  return stats.isAlphanumeric ? ColumnType.Alphanumeric : (stats.isNumeric ? ColumnType.Numeric : ColumnType.Mixed);
}

@Injectable()
export class NewDatasetEffects {
  @Effect()
  previewFile$ = this.actions$.pipe(
    ofType<FileChosen>(NewDatasetActionTypes.FileChosen),
    switchMap(action => {
      return new Observable<NewDatasetAction>((subscriber) => {
        parse(action.payload, {
          header: true,
          // Only load the first 10 lines, as the file could be huge.
          preview: 10,
          error: (err) => {
            subscriber.next(new LoadFileError(err));
          },
          complete: (result) => {
            subscriber.next(new FilePreviewed(result));
          }
        });
      })
    })
  );

  @Effect()
  saveDataset$ = this.actions$.pipe(
    ofType<CreateDataset>(NewDatasetActionTypes.CreateDataset),
    withLatestFrom(
      this.store.select(getFile),
      this.store.select(getColumns)
    ),
    mergeMap(([_, file, columns]) => {
      if (file && columns) {
        const cols = columns.reduce<number[]>((acc, c, i) => acc.concat(c.included ? [i] : []), []);
        const statsProcessor = new StatsProcessor(cols.length);

        return processCsvFile(file, { hasHeader: true, columns: cols }, statsProcessor).pipe(
          mergeMap(stats => {
            const chartProcessor = new ChartAndHistogramProcessor(stats);

            return processCsvFile(file, { hasHeader: true, columns: cols}, chartProcessor).pipe(
              map(charts => {
                return new DatasetSaved({ dataset: {
                  id: -1,
                  filename: file.name,
                  size: file.size,
                  created: Date.now(),
                  columns: columns.filter(c => c.included).map((column, i) => ({
                    name: column.name,
                    type: getColumnType(stats[i]),
                    stats: {
                      min: stats[i].min,
                      max: stats[i].max,
                      avg: stats[i].avg,
                      uniqueCount: stats[i].uniqueValues.numeric + stats[i].uniqueValues.alphanumeric,
                      exceededUniqueLimit: stats[i].uniqueValues.exceededLimit
                    },
                    chart: charts[i]
                  }))
                }});
              })
            )
          })
        )
      }

      return of();
    })
  );

  constructor(private actions$: Actions, private store: Store<AppState>) {}
}