import { createFeatureSelector, createSelector } from '@ngrx/store'
import { NewDataset } from './new-dataset.reducer';

const getNewDataset = createFeatureSelector<NewDataset>('newDataset');
export const getFilePreview = createSelector(getNewDataset, state => state.filePreview);
export const getColumns = createSelector(getNewDataset, state => state.columns);
export const getFile = createSelector(getNewDataset, state => state.file);