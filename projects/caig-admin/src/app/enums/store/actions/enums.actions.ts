import {createAction, props} from '@ngrx/store';
import {EnumsState} from '../reducers';

export const loadEnums = createAction(
  '[ Enums ] Load Enums',
  props<{enumType: keyof EnumsState}>(),
);

export const enumsLoaded = createAction(
  '[ Enums ] Enums Loaded',
  props<{enumType: keyof EnumsState, payload: any[]}>(),
);

export const invalidateEnums = createAction(
  '[ Enums ] Invalidated Enums',
  props<{enumType: keyof EnumsState}>(),
);
