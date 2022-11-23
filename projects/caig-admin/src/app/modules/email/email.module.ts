import {NgModule} from '@angular/core';
import {EmailMaterialModule} from './email-material.module';
import {ComposeEmailComponent} from './components/compose-email/compose-email.component';
import {EmailEditorComponent} from './components/email-editor/email-editor.component';
import {EmailPreviewComponent} from './components/email-preview/email-preview.component';
import {TemplateSelectionComponent} from './components/template-selection/template-selection.component';
import {EmailRoutingModule} from './email-routing.module';
import {EmployeeResolver} from './services/employee-resolver';
import {CommonModule} from '@angular/common';
import {BatchResolver} from './services/batch-resolver';
import {BatchEmailComponent} from './components/batch-email/batch-email.component';

@NgModule({
  imports: [
    EmailRoutingModule,
    EmailMaterialModule,
    CommonModule,
  ],
  declarations: [
    ComposeEmailComponent,
    EmailEditorComponent,
    EmailPreviewComponent,
    TemplateSelectionComponent,
    BatchEmailComponent,
  ],
  providers: [
    EmployeeResolver,
    BatchResolver,
  ],
})
export class EmailModule { }
