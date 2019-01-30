import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DatasetsState } from './datasets.reducer';

@Injectable()
export class DatasetsEffects {
  constructor(
    private actions$: Actions,
    private store: Store<DatasetsState>
    ) {}
}
