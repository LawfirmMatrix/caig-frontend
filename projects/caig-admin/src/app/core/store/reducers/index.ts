import {createReducer, on} from '@ngrx/store';
import {CoreActions} from '../actions/action-types';
import {Portal, User, UserSettlement} from '../../../models/session.model';
import {AuthActions} from '../../../auth/store/actions/action-types';

export interface CoreState {
  user: User | undefined;
  settlements: UserSettlement[] | undefined;
  settlementId: number | undefined;
  mustPasswordChange: boolean | undefined;
  portal: Portal | undefined;
}

export const initialCoreState: CoreState = {
  user: undefined,
  settlements: undefined,
  settlementId: undefined,
  mustPasswordChange: undefined,
  portal: undefined,
};

export const coreReducer = createReducer(
  initialCoreState,
  on(CoreActions.sessionInitialized, (state, action) => ({...state, ...action.session})),
  on(CoreActions.portalChange, (state, action) => ({...state, portal: action.portal})),
  on(CoreActions.initializeSettlementContext, (state, action) => ({...state, settlementId: action.settlementId})),
  on(CoreActions.settlementChange, (state, action) => ({...state, settlementId: action.settlementId})),
  on(AuthActions.logout, (state, action) => ({...initialCoreState}))
);
