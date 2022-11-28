import {createAction, props} from '@ngrx/store';
import {EmailTemplateShort} from '../../../../core/services/email.service';

export const loadEmailTemplates = createAction('[Compose Email] Load Email Templates');

export const addEmailTemplate = createAction('[Email Template Editor] Add Email Template', props<{template: EmailTemplateShort}>());

export const updateEmailTemplate = createAction('[Email Template Editor] Update Email Template', props<{template: EmailTemplateShort}>());

export const removeEmailTemplate = createAction('[Compose Email] Remove Email Template', props<{templateId: string}>());

export const emailTemplatesLoaded = createAction(
  '[Load Email Templates Effect] Email Templates Loaded',
  props<{templates: EmailTemplateShort[]}>(),
);

export const loadFields = createAction('[Email Template Editor] Load Fields');

export const fieldsLoaded = createAction(
  '[Load Fields Effect] Fields Loaded',
  props<{fields: string[]}>(),
);
