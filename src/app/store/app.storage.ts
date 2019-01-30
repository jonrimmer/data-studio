import { ActionReducer } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

export function appStorage(reducer: ActionReducer<any>): ActionReducer<any> {
  const config = {
    keys: [
      'datasets'
    ],
    rehydrate: true,
    removeOnUndefined: true
  };

  return localStorageSync(config)(reducer);
}
