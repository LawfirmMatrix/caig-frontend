import {createAction, props} from '@ngrx/store';
import {User, UserRole} from '../../../../models/session.model';

export const loadUsers = createAction('[ Users ] Load Users');

export const usersLoaded = createAction(
  '[ Users ] Users Loaded',
  props<{users: User[]}>(),
);

export const invalidateUsers = createAction('[ Users ] Invalidated Users');

export const loadRoles = createAction('[ Edit User ] Load User Roles');

export const rolesLoaded = createAction(
  '[Load Roles Effect] User Roles Loaded',
  props<{roles: UserRole[]}>(),
);
