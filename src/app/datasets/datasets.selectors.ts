import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DatasetsState } from './datasets.reducer';
import * as fromDataset from './datasets.reducer';

export const getDatasets = createFeatureSelector<DatasetsState>('datasets');

export const allDatasetsLoaded = createSelector(getDatasets, state => state.allDatasetsLoaded);

export const getAllDatasets = createSelector(getDatasets, fromDataset.selectAll); 
export const getDatasetById = (id: number) => createSelector(getDatasets, state => state.entities[id]);