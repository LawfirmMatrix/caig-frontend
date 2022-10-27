import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../../environments/environment';

export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {

};

function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log(action.type);
    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : [];
