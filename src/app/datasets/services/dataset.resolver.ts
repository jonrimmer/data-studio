import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from 'src/app/reducers';
import { Dataset } from '../model/dataset';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { getDatasetById } from '../datasets.selectors';
import { AllDatasetsRequested } from '../datasets.actions';
import { tap, filter, first } from 'rxjs/operators';

@Injectable()
export class DatasetResolver implements Resolve<Dataset> {
  constructor(private store: Store<AppState>) { }

  resolve(route: ActivatedRouteSnapshot): Observable<Dataset> {
    const datasetId = route.params['id'];

    return this.store.pipe(
      select(getDatasetById(datasetId)),
      tap(dataset => {
        if (!dataset) {
          this.store.dispatch(new AllDatasetsRequested())
        }
      }),
      filter(dataset => !!dataset),
      first()
    );
  }
}
