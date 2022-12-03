import {createReducer, on} from '@ngrx/store';
import {cloneDeep} from 'lodash-es';
import {EmailTemplateShort} from '../../../../core/services/email.service';
import {EmailActions} from '../actions/action-types';
import {SignatureBlock} from '../../../../models/signature.model';

export interface EmailState {
  emailTemplates: EmailTemplateShort[] | undefined;
  emailSignatures: SignatureBlock[] | undefined;
  fields: string[] | undefined;
}

export const initialEmailState: EmailState = {
  emailTemplates: undefined,
  emailSignatures: undefined,
  fields: undefined,
};

export const emailReducer = createReducer(
  initialEmailState,
  on(EmailActions.emailTemplatesLoaded, (state, action) => ({... state, emailTemplates: [...state.emailTemplates || [], ...action.templates] })),
  on(EmailActions.emailSignaturesLoaded, (state, action) => ({... state, emailSignatures: [...state.emailSignatures || [], ...action.signatures] })),
  on(EmailActions.addEmailTemplate, (state, action) => ({...state, emailTemplates: [action.template, ...(state.emailTemplates || [])]})),
  on(EmailActions.addEmailSignature, (state, action) => ({...state, emailSignatures: [action.signature, ...(state.emailSignatures || [])]})),
  on(EmailActions.updateEmailTemplate, (state, action) => {
    const emailTemplates = cloneDeep(state.emailTemplates || []);
    const index = emailTemplates.findIndex((t) => t.id === action.template.id);
    emailTemplates.splice(index, 1, action.template);
    return { ...state, emailTemplates };
  }),
  on(EmailActions.updateEmailSignature, (state, action) => {
    const emailSignatures = cloneDeep(state.emailSignatures || []);
    const index = emailSignatures.findIndex((t) => t.id === action.signature.id);
    emailSignatures.splice(index, 1, action.signature);
    return { ...state, emailSignatures };
  }),
  on(EmailActions.removeEmailTemplate, (state, action) => ({...state, emailTemplates: state.emailTemplates?.filter((t) => t.id !== action.templateId)})),
  on(EmailActions.removeEmailSignature, (state, action) => ({...state, emailSignatures: state.emailSignatures?.filter((t) => t.id !== action.signatureId)})),
  on(EmailActions.fieldsLoaded, (state, action) => ({...state, fields: action.fields})),
);
