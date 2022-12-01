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
import {FlexLayoutModule} from '@angular/flex-layout';
import {DynamicFormModule} from 'dynamic-form';
import {TagSelectorComponent} from './components/tag-selector/tag-selector.component';
import {StoreModule} from '@ngrx/store';
import {emailReducer} from './store/reducers';
import {EffectsModule} from '@ngrx/effects';
import {EmailEffects} from './store/effects/email.effects';
import {QuillModule} from 'ngx-quill';
import {TemplateEditorComponent} from './components/template-editor/template-editor.component';
import {FormsModule} from '@angular/forms';
import {PipesModule} from 'pipes';

@NgModule({
  imports: [
    EmailRoutingModule,
    EmailMaterialModule,
    CommonModule,
    FlexLayoutModule,
    DynamicFormModule,
    StoreModule.forFeature('email', emailReducer),
    EffectsModule.forFeature([EmailEffects]),
    QuillModule,
    FormsModule,
    PipesModule,
  ],
  declarations: [
    ComposeEmailComponent,
    EmailEditorComponent,
    EmailPreviewComponent,
    TemplateSelectionComponent,
    BatchEmailComponent,
    TagSelectorComponent,
    TemplateEditorComponent,
  ],
  providers: [
    EmployeeResolver,
    BatchResolver,
  ],
})
export class EmailModule { }
