import { Action } from '@ngrx/store';
import { Dataset } from './model/dataset';

export enum DatasetActionTypes {
  AddDataset = '[New Dataset Page] Add Dataset',
  AllDatasetsRequested = '[Datasets API] All Datasets Requested',
  AllDatasetsLoaded = '[Datasets API] All Datasets Loaded',
  DatasetDeleted = '[Datasets API] Dataset Deleted'
};

export class DatasetAdded implements Action {
  readonly type = DatasetActionTypes.AddDataset;
  constructor(public payload: { dataset: Dataset }) { }
}

export class DatasetDeleted implements Action {
  readonly type = DatasetActionTypes.DatasetDeleted;
  constructor (public payload: number) {}
}

export type DatasetActions =
  DatasetAdded
  | DatasetDeleted;