import {routerReducer} from '@ngrx/router-store';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { environment } from 'src/environments/environment';
import { appStorage } from './app.storage';

export interface AppState {}

export const reducers: ActionReducerMap<AppState> = {
  router: routerReducer
}

export const metaReducers: MetaReducer<AppState>[] = 
  !environment.production ? [appStorage] : [appStorage];
