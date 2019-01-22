import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DatasetsState } from './datasets.reducer';
import * as fromDataset from './datasets.reducer';
import { getRouterState } from '../store/app.selectors';

export const getDatasets = createFeatureSelector<DatasetsState>('datasets');

export const allDatasetsLoaded = createSelector(getDatasets, state => state.allDatasetsLoaded);

export const getAllDatasets = createSelector(getDatasets, fromDataset.selectAll); 
export const getDatasetById = (id: number) => createSelector(getDatasets, state => state.entities[id]);

export const getDataset = createSelector(
  getRouterState,
  getDatasets,
  (router, datasets) => datasets.entities[router.state.params.datasetId]
);

export const getColumn = createSelector(
  getRouterState,
  getDataset,
  (router, dataset) => dataset.columns[router.state.params.columnId]
);
