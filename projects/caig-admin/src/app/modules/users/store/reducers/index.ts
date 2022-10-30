import {createReducer, on} from '@ngrx/store';
import {User, UserRole} from '../../../../models/session.model';
import {UserActions} from '../actions/action-types';
import {AuthActions} from '../../../../auth/store/actions/action-types';

export interface UsersState {
  forSettlement: User[] | undefined;
  roles: UserRole[] | undefined;
}

export const initialUsersState: UsersState = {
  forSettlement: undefined,
  roles: undefined,
};

export const usersReducer = createReducer(
  initialUsersState,
  on(UserActions.loadUsers, (state, action) => ({... state, forSettlement: undefined })),
  on(UserActions.usersLoaded, (state, action) => ({ ...state, forSettlement: action.users })),
  on(UserActions.rolesLoaded, (state, action) => ({...state, roles: action.roles})),
  on(AuthActions.logout, (state, action) => ({...initialUsersState})),
);
