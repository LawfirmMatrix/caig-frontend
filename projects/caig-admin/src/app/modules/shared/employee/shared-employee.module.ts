import {NgModule} from '@angular/core';
import {EmployeeContactComponent} from './component/employee-contact/employee-contact.component';
import {EventsComponent} from './component/events/events.component';
import {ToolbarButtonsComponent} from './component/toolbar-buttons/toolbar-buttons.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared.module';
import {FormsModule} from '@angular/forms';
import {DynamicFormModule} from 'dynamic-form';
import {SurveyResponsesComponent} from './component/survey-responses/survey-responses.component';
import {DocumentsComponent} from './component/documents/documents.component';
import {FileUploadModule} from 'file-upload';
import {MatProgressBarModule} from '@angular/material/progress-bar';
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
    DynamicFormModule,
    RouterModule,
    FileUploadModule,
    VsTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTabsModule,
  ],
  declarations: [
    EmployeeContactComponent,
    EventsComponent,
    ToolbarButtonsComponent,
    SurveyResponsesComponent,
    DocumentsComponent,
    PhoneTextComponent,
  ],
  exports: [
    EmployeeContactComponent,
    EventsComponent,
    ToolbarButtonsComponent,
    SurveyResponsesComponent,
    DocumentsComponent,
  ],
  providers: [
    UnsavedChangesGuard,
    SettlementUsersResolver,
  ],
})
export class SharedEmployeeModule { }
