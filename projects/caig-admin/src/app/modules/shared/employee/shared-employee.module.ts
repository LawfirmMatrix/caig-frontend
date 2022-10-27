import {NgModule} from '@angular/core';
import {EmployeeContactComponent} from './component/employee-contact/employee-contact.component';
import {EventsComponent} from './component/events/events.component';
import {ToolbarButtonsComponent} from './component/toolbar-buttons/toolbar-buttons.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared.module';
import {ComposeEmailComponent} from './component/compose-email/compose-email.component';
import {MatCardModule} from '@angular/material/card';
import {FormsModule} from '@angular/forms';
import {QuillModule} from 'ngx-quill';
import {MatTooltipModule} from '@angular/material/tooltip';
import {DynamicFormModule} from 'dynamic-form';
import {SurveyResponsesComponent} from './component/survey-responses/survey-responses.component';
import {DocumentsComponent} from './component/documents/documents.component';
import {FileUploadModule} from 'file-upload';
import {EmailTemplateComponent} from './component/email-template/email-template.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {EmailBodyEditorComponent} from './component/email-body-editor/email-body-editor.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {VsTableModule} from 'vs-table';
import {UnsavedChangesGuard} from './service/unsaved-changes.guard';
import {PhoneTextComponent} from './component/phone-text/phone-text.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {SettlementUsersResolver} from './service/settlement-users.resolver';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  imports: [
    SharedModule,
    FormsModule,
    QuillModule,
    DynamicFormModule,
    MatTooltipModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
    RouterModule,
    FileUploadModule,
    VsTableModule,
  ],
  declarations: [
    EmployeeContactComponent,
    EventsComponent,
    ToolbarButtonsComponent,
    ComposeEmailComponent,
    SurveyResponsesComponent,
    DocumentsComponent,
    EmailTemplateComponent,
    EmailBodyEditorComponent,
    PhoneTextComponent,
  ],
  exports: [
    EmployeeContactComponent,
    EventsComponent,
    ToolbarButtonsComponent,
    ComposeEmailComponent,
    SurveyResponsesComponent,
    DocumentsComponent,
    EmailTemplateComponent,
    EmailBodyEditorComponent,
  ],
  providers: [
    UnsavedChangesGuard,
    SettlementUsersResolver,
  ],
})
export class SharedEmployeeModule { }
