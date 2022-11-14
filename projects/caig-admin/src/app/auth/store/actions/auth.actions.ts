import {createAction, props} from '@ngrx/store';
import {AuthToken} from '../../../models/token.model';

export const login = createAction(
  '[Login Page] User Login',
  props<{token: AuthToken}>()
);

export const logout = createAction(
  '[Top Menu] Logout',
  props<{redirectUrl?: string}>(),
);
