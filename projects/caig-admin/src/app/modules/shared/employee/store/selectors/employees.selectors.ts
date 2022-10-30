import {createFeatureSelector, createSelector} from '@ngrx/store';
import {EmployeesState} from '../reducers';

export const selectEmployeesState = createFeatureSelector<EmployeesState>('employees');

export const emailTemplates = createSelector(
  selectEmployeesState,
  state => state.emailTemplates,
);

export const fields = createSelector(
  selectEmployeesState,
  state => state.fields,
);
