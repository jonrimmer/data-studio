import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Dataset } from './model/dataset';
import { DatasetActions, DatasetActionTypes } from './datasets.actions';

export interface DatasetsState extends EntityState<Dataset> {}

export const adapter = createEntityAdapter<Dataset>();

export const initialState: DatasetsState = adapter.getInitialState();

export function datasetsReducer(state = initialState, action: DatasetActions) {
  switch(action.type) {
    case DatasetActionTypes.AddDataset:
      return adapter.addOne(action.payload.dataset, state);
    case DatasetActionTypes.DatasetDeleted:
      return adapter.removeOne(action.payload, state);
    default:
      return state;
  }
}

export const {
  selectAll,
  selectEntities,
  selectIds,
  selectTotal
} = adapter.getSelectors();
