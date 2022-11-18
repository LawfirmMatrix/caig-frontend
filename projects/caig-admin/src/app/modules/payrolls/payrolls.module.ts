import {NgModule} from '@angular/core';
import {PayrollsRoutingModule} from './payrolls-routing.module';
import {PayrollsMaterialModule} from './payrolls-material.module';
import {PayrollsListComponent} from './components/payrolls-list/payrolls-list.component';
import {PayrollsResolver} from './services/payrolls-resolver';
import {AddToPayrollComponent} from './components/add-to-payroll/add-to-payroll.component';
import {CommonModule} from '@angular/common';
import {PreviewResolver} from './services/preview-resolver';
import {VsTableModule} from 'vs-table';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DynamicFormModule} from 'dynamic-form';
import {ViewPayrollComponent} from './components/view-payroll/view-payroll.component';
import {SinglePayrollResolver} from './services/single-payroll-resolver';

@NgModule({
  imports: [
    PayrollsRoutingModule,
    PayrollsMaterialModule,
    CommonModule,
    VsTableModule,
    FlexLayoutModule,
    DynamicFormModule,
  ],
  declarations: [
    PayrollsListComponent,
    AddToPayrollComponent,
    ViewPayrollComponent,
  ],
  providers: [
    PayrollsResolver,
    PreviewResolver,
    SinglePayrollResolver,
  ]
})
export class PayrollsModule { }
