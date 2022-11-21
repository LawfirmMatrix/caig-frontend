import {createReducer, on} from '@ngrx/store';
import {CoreActions} from '../actions/action-types';
import {Portal, User, UserSettlement, Role} from '../../../models/session.model';
import {AuthActions} from '../../../auth/store/actions/action-types';
import {CoreEffects} from '../effects/core.effects';

export interface CoreState {
  user: User | undefined;
  settlements: UserSettlement[] | undefined;
  settlementId: number | undefined;
  mustChangePassword: boolean | undefined;
  portal: Portal | undefined;
}

export const initialCoreState: CoreState = {
  user: undefined,
  settlements: undefined,
  settlementId: undefined,
  mustChangePassword: undefined,
  portal: undefined,
};

export const coreReducer = createReducer(
  initialCoreState,
  on(CoreActions.sessionInitialized, (state, action) => ({
    ...state,
    ...action.session,
    portal: action.session.user.roleId === Role.Superadmin ?
      (validatePortal(localStorage.getItem(CoreEffects.PORTAL_KEY)) || action.session.portal) :
      action.session.portal,
  })),
  on(CoreActions.portalChange, (state, action) => ({...state, portal: action.portal})),
  on(CoreActions.initializeSettlementContext, (state, action) => ({...state, settlementId: action.settlementId})),
  on(CoreActions.settlementChange, (state, action) => ({...state, settlementId: action.settlementId})),
  on(AuthActions.logout, (state, action) => ({...initialCoreState}))
);

function validatePortal(storedPortal: string | null): Portal | null {
  if (storedPortal && Object.values(Role).includes(storedPortal)) {
    return storedPortal as Portal;
  }
  return null;
}
