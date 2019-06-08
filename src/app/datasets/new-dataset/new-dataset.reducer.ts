import * as NewDatasetActions from './new-dataset.actions';
import { ParseResult } from 'papaparse';
import { ParseError } from '@angular/compiler';
import { createReducer, on, Action } from '@ngrx/store';

export interface NewDataset {
  file: File | null;
  filePreview: ParseResult | null;
  filePreviewError: ParseError | null;
  columns: Column[];
}

export interface NewDatasetState {
  readonly fileSelect: NewDataset;
}

export interface Column {
  name: string;
  included: boolean;
}

export const initialState: NewDataset = {
  file: null,
  filePreview: null,
  filePreviewError: null,
  columns: []
};

export const newDatasetReducer = createReducer(
  initialState,
  on(NewDatasetActions.fileChosen, (state, { file }) => ({
    ...state,
    file
  })),
  on(NewDatasetActions.filePreviewed, (state, { result }) => ({
    ...state,
    filePreview: result,
    columns: result.meta.fields.map(name => ({
      name,
      included: true
    }))
  })),
  on(NewDatasetActions.clearFile, state => ({
    ...state,
    file: null,
    filePreview: null,
    columns: []
  })),
  on(NewDatasetActions.columnToggled, (state, { index }) => ({
    ...state,
    columns: state.columns.map((c, i) =>
      i !== index ? c : { name: c.name, included: !c.included }
    )
  }))
);

export function reducer(state: NewDataset | undefined, action: Action) {
  return newDatasetReducer(state, action);
}
