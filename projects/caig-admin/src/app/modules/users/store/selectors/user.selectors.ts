import {createFeatureSelector, createSelector} from '@ngrx/store';
import {UsersState} from '../reducers';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const usersForSettlement = createSelector(
  selectUsersState,
  state => state.forSettlement,
);

export const roles = createSelector(
  selectUsersState,
  state => state.roles,
);
