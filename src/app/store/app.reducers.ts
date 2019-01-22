import {routerReducer} from '@ngrx/router-store';
import { ActionReducerMap } from '@ngrx/store';

export interface AppState {}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer
}
