import {createReducer, on} from '@ngrx/store';
import {AuthActions} from '../actions/action-types';
import {AuthToken} from '../../../models/token.model';

export interface AuthState {
  token: AuthToken | undefined;
}

export const initialAuthState: AuthState = {
  token: undefined,
};

export const authReducer = createReducer(
    initialAuthState,
    on(AuthActions.login, (state, action) => ({ ...state, token: action.token })),
    on(AuthActions.logout, (state, action) => ({ ...initialAuthState })),
);
