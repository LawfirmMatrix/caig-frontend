import {createReducer, on} from '@ngrx/store';
import {EmailTemplateShort} from '../../../../../core/services/email.service';
import {EmployeesActions} from '../actions/action-types';
import {cloneDeep} from 'lodash-es';

export interface EmployeesState {
  emailTemplates: EmailTemplateShort[] | undefined;
  fields: string[] | undefined;
}

export const initialEmployeesState: EmployeesState = {
  emailTemplates: undefined,
  fields: undefined,
};

export const employeesReducer = createReducer(
  initialEmployeesState,
  on(EmployeesActions.emailTemplatesLoaded, (state, action) => ({... state, emailTemplates: [...state.emailTemplates || [], ...action.templates] })),
  on(EmployeesActions.addEmailTemplate, (state, action) => ({...state, emailTemplates: [action.template, ...(state.emailTemplates || [])]})),
  on(EmployeesActions.updateEmailTemplate, (state, action) => {
    const emailTemplates = cloneDeep(state.emailTemplates || []);
    const index = emailTemplates.findIndex((t) => t.id === action.template.id);
    emailTemplates.splice(index, 1, action.template);
    return { ...state, emailTemplates };
  }),
  on(EmployeesActions.removeEmailTemplate, (state, action) => ({...state, emailTemplates: state.emailTemplates?.filter((t) => t.id !== action.templateId)})),
  on(EmployeesActions.fieldsLoaded, (state, action) => ({...state, fields: action.fields})),
);
