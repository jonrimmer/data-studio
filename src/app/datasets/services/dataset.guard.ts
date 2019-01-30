import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { getDataset } from '../datasets.selectors';
import { map } from 'rxjs/operators';
import { DatasetsState } from '../datasets.reducer';

@Injectable()
export class DatasetGuard implements CanActivate {
  constructor(private store: Store<DatasetsState>, private router: Router) { }

  canActivate(): Observable<boolean | UrlTree> {
    return this.store.select(getDataset).pipe(
      map(ds => ds ? true : this.router.parseUrl('/datasets'))
    );
  }
}
