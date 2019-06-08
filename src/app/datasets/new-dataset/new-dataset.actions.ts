import { createAction, props } from '@ngrx/store';
import { ParseError, ParseResult } from 'papaparse';

export const fileChosen = createAction(
  '[New Dataset] File Chosen',
  props<{ file: File }>()
);

export const loadFileError = createAction(
  '[New Dataset] Load File Error',
  props<{ error: ParseError }>()
);

export const filePreviewed = createAction(
  '[New Dataset] File Previewed',
  props<{ result: ParseResult }>()
);

export const createDataset = createAction('[New Dataset] Create Dataset');

export const columnToggled = createAction(
  '[New Dataset] Column Toggled',
  props<{ index: number }>()
);

export const clearFile = createAction('[New Dataset] Clear File');
