import {createAction, props} from '@ngrx/store';
import {EmailTemplateShort} from '../../../../core/services/email.service';
import {SignatureBlock} from '../../../../models/signature.model';

export const loadEmailTemplates = createAction('[Compose Email] Load Email Templates');

export const addEmailTemplate = createAction('[Email Template Editor] Add Email Template', props<{template: EmailTemplateShort}>());

export const updateEmailTemplate = createAction('[Email Template Editor] Update Email Template', props<{template: EmailTemplateShort}>());

export const removeEmailTemplate = createAction('[Compose Email] Remove Email Template', props<{templateId: string}>());

export const emailTemplatesLoaded = createAction(
  '[Load Email Templates Effect] Email Templates Loaded',
  props<{templates: EmailTemplateShort[]}>(),
);

export const loadEmailSignatures = createAction('[Compose Email] Load Email Signatures');

export const addEmailSignature = createAction('[Email Signature Editor] Add Email Signature', props<{signature: SignatureBlock}>());

export const updateEmailSignature = createAction('[Email Signature Editor] Update Email Signature', props<{signature: SignatureBlock}>());

export const removeEmailSignature = createAction('[Compose Email] Remove Email Signature', props<{signatureId: string}>());

export const emailSignaturesLoaded = createAction(
  '[Load Email Signatures Effect] Email Signatures Loaded',
  props<{signatures: SignatureBlock[]}>(),
);

export const loadFields = createAction('[Email Template Editor] Load Fields');

export const fieldsLoaded = createAction(
  '[Load Fields Effect] Fields Loaded',
  props<{fields: string[]}>(),
);
