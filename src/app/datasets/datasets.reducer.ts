import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { Dataset } from './model/dataset';
import { DatasetActions, DatasetActionTypes } from './datasets.actions';

export interface DatasetsState extends EntityState<Dataset> {
  allDatasetsLoaded: boolean;
}

export const adapter = createEntityAdapter<Dataset>();

export const initialDatasetsState: DatasetsState = adapter.getInitialState({
  allDatasetsLoaded: false
});

export function datasetsReducer(state = initialDatasetsState, action: DatasetActions) {
  switch(action.type) {
    case DatasetActionTypes.DatasetAdded:
      return adapter.addOne(action.payload.dataset, state);
    case DatasetActionTypes.AllDatasetsLoaded:
      return adapter.addAll(action.payload, { ...state, allDatasetsLoaded: true });
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
