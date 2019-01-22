import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { allDatasetsLoaded } from '../datasets.selectors';
import { AllDatasetsRequested } from '../datasets.actions';
import { tap, filter, first, map } from 'rxjs/operators';
import { DatasetsState } from '../datasets.reducer';

@Injectable()
export class DatasetsGuard implements CanActivate {
  constructor(private store: Store<DatasetsState>) { }

  canActivate(
    ): Observable<boolean> {
      return this.store.pipe(
        select(allDatasetsLoaded),
        tap(loaded => {
          if (!loaded) {
            this.store.dispatch(new AllDatasetsRequested());
          }
        }),
        filter(loaded => loaded),
        first()
      );
    }
}
