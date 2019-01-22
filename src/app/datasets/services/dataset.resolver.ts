import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Dataset } from '../model/dataset';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { getDatasetById } from '../datasets.selectors';
import { AllDatasetsRequested } from '../datasets.actions';
import { tap, filter, first } from 'rxjs/operators';
import { DatasetsState } from '../datasets.reducer';

@Injectable()
export class DatasetResolver implements Resolve<Dataset> {
  constructor(private store: Store<DatasetsState>) { }

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
