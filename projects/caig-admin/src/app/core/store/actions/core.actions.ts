import {createAction, props} from '@ngrx/store';
import {Portal, Session} from '../../../models/session.model';

export const sessionInitialized = createAction(
  '[Session Resolver] Session Initialized',
  props<{session: Session}>()
);

export const initializeSettlementContext = createAction(
  '[Session Initialized Effect] Initialize Settlement Context',
  props<{settlementId?: number}>()
);

export const settlementChange = createAction(
  '[Settlement Selector] Set Settlement ID',
  props<{settlementId: number}>(),
);

export const portalChange = createAction(
  '[Portal Selector] Set Portal',
  props<{portal: Portal}>(),
);
