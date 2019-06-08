import { createAction, props } from '@ngrx/store';
import { Dataset } from './model/dataset';

export const datasetAdded = createAction(
  '[New Dataset Page] Add Dataset',
  props<{ dataset: Dataset }>()
);

export const datasetDeleted = createAction(
  '[Datasets API] Dataset Deleted',
  props<{ id: number }>()
);
