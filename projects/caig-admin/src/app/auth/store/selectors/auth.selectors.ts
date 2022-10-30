import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AuthState} from '../reducers';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const authToken = createSelector(
  selectAuthState,
  auth => auth.token,
);

export const isLoggedIn = createSelector(
  authToken,
  token =>  !!token,
);

export const isLoggedOut = createSelector(
  isLoggedIn,
  isLoggedIn => !isLoggedIn,
);
