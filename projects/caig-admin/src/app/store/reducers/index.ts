import {ActionReducer, ActionReducerMap, MetaReducer} from '@ngrx/store';
import {environment} from '../../../environments/environment';
import {AuthActions} from '../../auth/store/actions/action-types';

export interface AppState {

}

export const reducers: ActionReducerMap<AppState> = {

};

function logoutReset(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => reducer(action.type === AuthActions.logout.type ? {} : state, action);
}

function logger(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    console.log(action.type);
    return reducer(state, action);
  }
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger, logoutReset] : [logoutReset];
