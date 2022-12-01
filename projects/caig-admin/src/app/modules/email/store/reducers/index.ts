import {createReducer, on} from '@ngrx/store';
import {cloneDeep} from 'lodash-es';
import {EmailTemplateShort} from '../../../../core/services/email.service';
import {EmailActions} from '../actions/action-types';

export interface EmailState {
  emailTemplates: EmailTemplateShort[] | undefined;
  fields: string[] | undefined;
}

export const initialEmailState: EmailState = {
  emailTemplates: undefined,
  fields: undefined,
};

export const emailReducer = createReducer(
  initialEmailState,
  on(EmailActions.emailTemplatesLoaded, (state, action) => ({... state, emailTemplates: [...state.emailTemplates || [], ...action.templates] })),
  on(EmailActions.addEmailTemplate, (state, action) => ({...state, emailTemplates: [action.template, ...(state.emailTemplates || [])]})),
  on(EmailActions.updateEmailTemplate, (state, action) => {
    const emailTemplates = cloneDeep(state.emailTemplates || []);
    const index = emailTemplates.findIndex((t) => t.id === action.template.id);
    emailTemplates.splice(index, 1, action.template);
    return { ...state, emailTemplates };
  }),
  on(EmailActions.removeEmailTemplate, (state, action) => ({...state, emailTemplates: state.emailTemplates?.filter((t) => t.id !== action.templateId)})),
  on(EmailActions.fieldsLoaded, (state, action) => ({...state, fields: action.fields})),
);
