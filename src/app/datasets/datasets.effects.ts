import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DatasetsService } from './services/datasets.service';
import { DatasetActionTypes, DatasetAdded, AllDatasetsRequested, AllDatasetsLoaded, DatasetDeleted } from './datasets.actions';
import { map, withLatestFrom, filter, switchMap, finalize } from 'rxjs/operators';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { allDatasetsLoaded, getAllDatasets } from './datasets.selectors';

@Injectable()
export class DatasetsEffects {
  @Effect()
  loadAllDatasets = this.actions$
    .pipe(
      ofType<AllDatasetsRequested>(DatasetActionTypes.AllDatasetsRequested),
      withLatestFrom(this.store.select(allDatasetsLoaded)),
      filter(([_, allDatasetsLoaded]) => !allDatasetsLoaded),
      map(() => new AllDatasetsLoaded(this.datasetsService.loadAllDatasets()))
    );

  @Effect({ dispatch: false })
  saveToStorage$ = this.actions$
      .pipe(
        ofType<DatasetAdded | DatasetDeleted>(
          DatasetActionTypes.DatasetAdded,
          DatasetActionTypes.DatasetDeleted,
        ),
        withLatestFrom(this.store.select(getAllDatasets)),
        map(([_, all]) => {
          this.datasetsService.saveAllDatasets(all);
        })
      );

  constructor(
    private actions$: Actions,
    private datasetsService: DatasetsService,
    private store: Store<AppState>
    ) {}
}