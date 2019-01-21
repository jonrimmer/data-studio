import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { DatasetsService } from './services/datasets.service';
import { DatasetActionTypes, DatasetSaved, DatasetAdded, AllDatasetsRequested, AllDatasetsLoaded, DatasetDeleted } from './datasets.actions';
import { map, withLatestFrom, filter, switchMap, finalize } from 'rxjs/operators';
import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { allDatasetsLoaded, getAllDatasets } from './datasets.selectors';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable()
export class DatasetsEffects {
  @Effect()
  addDataset$ = this.actions$
    .pipe(
      ofType<DatasetSaved>(DatasetActionTypes.DatasetSaved),
      switchMap(action => {
        const id = this.datasetsService.getNextId();
        const dataset = {
          ...action.payload.dataset,
          id
        };
        return of(new DatasetAdded({ dataset })).pipe(finalize(() => {
          this.router.navigate(['/datasets', dataset.id]);
        }));
      })
    );

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
    private store: Store<AppState>,
    private router: Router
    ) {}
}