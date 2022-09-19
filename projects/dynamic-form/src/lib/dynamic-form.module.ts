import { NgModule } from '@angular/core';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {FieldControlService} from './field-control.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {DynamicFieldDirective} from './directive/dynamic-field.directive';
import {InputComponent} from './fields/input.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';

@NgModule({
  declarations: [
    DynamicFormComponent,
    DynamicFieldDirective,
    InputComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MatDividerModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatMenuModule,
    MatInputModule,
    MatTooltipModule,
  ],
  exports: [ DynamicFormComponent ],
  providers: [ FieldControlService ],
})
export class DynamicFormModule { }
