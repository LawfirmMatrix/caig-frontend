import {createFeatureSelector, createSelector} from '@ngrx/store';
import {CoreState} from '../reducers';
import {Role, Portal} from '../../../models/session.model';
import {PortalSelectionComponent} from '../../components/portal-selection/portal-selection.component';

export const selectCoreState = createFeatureSelector<CoreState>('core');

export const settlementId = createSelector(
  selectCoreState,
  core => core.settlementId,
);

export const settlements = createSelector(
  selectCoreState,
  core => core.settlements,
);

export const user = createSelector(
  selectCoreState,
  core => core.user,
);

export const portal = createSelector(
  selectCoreState,
  core => core.portal,
);

export const isAdmin = createSelector(
  user,
  user => user && [Role.Superadmin, Role.Administrator].indexOf(user.roleId) > -1
);

export const isSuperAdmin = createSelector(
  user,
  user => user && Role.Superadmin === user.roleId
);
