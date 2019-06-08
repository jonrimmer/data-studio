import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import {
  switchMap,
  mergeMap,
  withLatestFrom,
  concatMap,
  finalize
} from 'rxjs/operators';
import { Observable, of, EMPTY } from 'rxjs';
import { parse } from 'papaparse';
import { Store, Action } from '@ngrx/store';
import { getFile, getColumns } from './new-dataset.selectors';
import { processCsvFile } from 'src/app/processor/processor';
import { ColumnStats } from 'src/app/processor/column-stats';
import { StatsProcessor } from 'src/app/processor/stats-processor';
import * as DatasetActions from '../datasets.actions';
import { ColumnType, Dataset, ColumnValues } from '../model/dataset';
import { Column, NewDatasetState } from './new-dataset.reducer';
import { Router } from '@angular/router';
import { ColumnValuesProcessor } from 'src/app/processor/column-values-processor';
import { getNextUnusedId } from '../datasets.selectors';
import * as NewDatasetActions from './new-dataset.actions';

function getColumnType(stats: ColumnStats): ColumnType {
  return stats.isAlphanumeric
    ? ColumnType.Alphanumeric
    : stats.isNumeric
    ? ColumnType.Numeric
    : ColumnType.Mixed;
}

export function createDataset(
  id: number,
  file: File,
  columns: Column[],
  stats: ColumnStats[],
  values: ColumnValues[]
): Dataset {
  return {
    id,
    filename: file.name,
    size: file.size,
    created: Date.now(),
    columns: columns
      .filter(c => c.included)
      .map((column, i) => ({
        name: column.name,
        type: getColumnType(stats[i]),
        stats: {
          min: stats[i].min,
          max: stats[i].max,
          avg: stats[i].avg,
          uniqueCount:
            stats[i].uniqueValues.numeric + stats[i].uniqueValues.alphanumeric,
          exceededUniqueLimit: stats[i].uniqueValues.exceededLimit
        },
        values: values[i]
      }))
  };
}

@Injectable()
export class NewDatasetEffects {
  previewFile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewDatasetActions.fileChosen),
      switchMap(({ file }) => {
        return new Observable<Action>(subscriber => {
          parse(file, {
            header: true,
            // Only load the first 10 lines, as the file could be huge.
            preview: 10,
            error: error => {
              subscriber.next(NewDatasetActions.loadFileError({ error }));
            },
            complete: result => {
              subscriber.next(NewDatasetActions.filePreviewed({ result }));
            }
          });
        });
      })
    )
  );

  saveDataset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(NewDatasetActions.createDataset),
      withLatestFrom(
        this.store.select(getFile),
        this.store.select(getColumns),
        this.store.select(getNextUnusedId)
      ),
      concatMap(([_, file, columns, id]) => {
        if (file && columns) {
          const cols = columns.reduce<number[]>(
            (acc, c, i) => acc.concat(c.included ? [i] : []),
            []
          );
          const statsProcessor = new StatsProcessor(cols.length);

          return processCsvFile(
            file,
            { hasHeader: true, columns: cols },
            statsProcessor
          ).pipe(
            mergeMap(stats => {
              const chartProcessor = new ColumnValuesProcessor(stats);

              return processCsvFile(
                file,
                { hasHeader: true, columns: cols },
                chartProcessor
              ).pipe(
                mergeMap(charts => {
                  return of(
                    DatasetActions.datasetAdded({
                      dataset: createDataset(id, file, columns, stats, charts)
                    })
                  ).pipe(
                    finalize(() => {
                      this.router.navigate(['/datasets', id]);
                    })
                  );
                })
              );
            })
          );
        }
        return EMPTY;
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store<NewDatasetState>,
    private router: Router
  ) {}
}
