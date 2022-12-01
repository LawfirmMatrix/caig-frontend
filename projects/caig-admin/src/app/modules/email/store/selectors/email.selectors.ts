import {createFeatureSelector, createSelector} from '@ngrx/store';
import {EmailState} from '../reducers';

export const selectEmailState = createFeatureSelector<EmailState>('email');

export const emailTemplates = createSelector(
  selectEmailState,
  state => state.emailTemplates,
);

export const fields = createSelector(
  selectEmailState,
  state => state.fields,
);
