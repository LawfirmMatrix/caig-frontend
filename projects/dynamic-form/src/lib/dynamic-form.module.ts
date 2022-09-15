import { NgModule } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import { DynamicFormFieldComponent } from './dynamic-form-field/dynamic-form-field.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FieldControlService} from './field-control.service';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFormFieldComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  exports: [ DynamicFormComponent ],
  providers: [ FieldControlService ],
})
export class DynamicFormModule { }
