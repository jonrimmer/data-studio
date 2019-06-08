import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Dataset } from './model/dataset';
import * as DatasetActions from './datasets.actions';
import { createReducer, on, Action } from '@ngrx/store';

export interface DatasetsState extends EntityState<Dataset> {}

export const adapter = createEntityAdapter<Dataset>();

export const initialState: DatasetsState = adapter.getInitialState();

export const datasetsReducer = createReducer(
  initialState,
  on(DatasetActions.datasetAdded, (state, { dataset }) =>
    adapter.addOne(dataset, state)
  ),
  on(DatasetActions.datasetDeleted, (state, { id }) =>
    adapter.removeOne(id, state)
  )
);

export function reducer(state: DatasetsState | undefined, action: Action) {
  return datasetsReducer(state, action);
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
