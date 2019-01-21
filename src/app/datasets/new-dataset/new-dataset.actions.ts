import { Action } from '@ngrx/store';
import { ParseError, ParseResult } from 'papaparse';

export enum NewDatasetActionTypes {
  FileChosen = '[New Dataset] File Chosen',
  FilePreviewed = '[New Dataset] File Previewed',
  LoadFileError = '[New Dataset] Load File Error',
  CreateDataset = '[New Dataset] Create Dataset',
  ClearFile = '[New Dataset] Clear File',
  ColumnToggled = '[New Dataset] Column Toggled'
}

export class FileChosen implements Action {
  readonly type = NewDatasetActionTypes.FileChosen;
  constructor(public payload: File) {}
}

export class LoadFileError implements Action {
  readonly type = NewDatasetActionTypes.LoadFileError;
  constructor(public payload: ParseError) {}
}

export class FilePreviewed implements Action {
  readonly type = NewDatasetActionTypes.FilePreviewed;
  constructor(public payload: ParseResult) { }
}

export class CreateDataset implements Action {
  readonly type = NewDatasetActionTypes.CreateDataset;
}

export class ColumnToggled implements Action {
  readonly type = NewDatasetActionTypes.ColumnToggled;
  constructor(public payload: number ) { }
}

export class ClearFile implements Action {
  readonly type = NewDatasetActionTypes.ClearFile;
}

export type NewDatasetAction = 
  FileChosen
  | LoadFileError
  | FilePreviewed
  | CreateDataset
  | ColumnToggled
  | ClearFile;
