import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LayoutModule} from '@angular/cdk/layout';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {VsTableModule} from 'vs-table';
import {TestComponent} from './test.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatSliderModule} from '@angular/material/slider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {TableComponent} from './table/table.component';
import {FormComponent} from './form/form.component';
import {DynamicFormModule} from 'dynamic-form';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    VsTableModule,
    DynamicFormModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatSliderModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonToggleModule,
  ],
  exports: [ TestComponent ],
  declarations: [
    TestComponent,
    TableComponent,
    FormComponent
  ],
})
export class TestModule { }
