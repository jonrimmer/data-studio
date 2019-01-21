import { NewDatasetAction, NewDatasetActionTypes } from './new-dataset.actions';
import { ParseResult } from 'papaparse';
import { ParseError } from '@angular/compiler';

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

export function newDatasetReducer(state = initialState, action: NewDatasetAction): NewDataset {
  switch(action.type) {
    case NewDatasetActionTypes.FileChosen: {
      return {
        ...state,
        file: action.payload
      }
    }
    case NewDatasetActionTypes.FilePreviewed: {
      return {
        ...state,
        filePreview: action.payload,
        columns: action.payload.meta.fields.map(name => ({ name, included: true }))
      }
    }
    case NewDatasetActionTypes.LoadFileError: {
      return {
        ...state,
      }
    }
    case NewDatasetActionTypes.ClearFile: {
      return {
        ...state,
        file: null,
        filePreview: null,
        columns: []
      }
    }
    case NewDatasetActionTypes.ColumnToggled: {
      return {
        ...state,
        columns: state.columns.map((c, i) => 
          (i !== action.payload) ? c : { name: c.name, included: !c.included })
      }
    }
  }

  return state;
}