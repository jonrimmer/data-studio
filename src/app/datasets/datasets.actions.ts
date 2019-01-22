import { Action } from '@ngrx/store';
import { Dataset } from './model/dataset';

export enum DatasetActionTypes {
  DatasetAdded = '[Datasets API] Dataser Added',
  AllDatasetsRequested = '[Datasets API] All Datasets Requested',
  AllDatasetsLoaded = '[Datasets API] All Datasets Loaded',
  DatasetDeleted = '[Datasets API] Dataset Deleted'
};

export class DatasetAdded implements Action {
  readonly type = DatasetActionTypes.DatasetAdded;
  constructor(public payload: { dataset: Dataset }) { }
}

export class AllDatasetsRequested implements Action {
  readonly type = DatasetActionTypes.AllDatasetsRequested;
}

export class AllDatasetsLoaded implements Action {
  readonly type = DatasetActionTypes.AllDatasetsLoaded;
  constructor (public payload: Dataset[]) { }
}

export class DatasetDeleted implements Action {
  readonly type = DatasetActionTypes.DatasetDeleted;
  constructor (public payload: number) {}
}

export type DatasetActions =
  DatasetAdded
  | AllDatasetsRequested
  | AllDatasetsLoaded
  | DatasetDeleted;