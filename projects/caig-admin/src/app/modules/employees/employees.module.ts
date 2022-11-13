import {NgModule} from '@angular/core';
import {EmployeesMaterialModule} from './employees-material.module';
import {EmployeesRoutingModule} from './employees-routing.module';
import {EmployeesListComponent} from './components/employees-list/employees-list.component';
import {DynamicFormModule} from 'dynamic-form';
import {VsTableModule} from 'vs-table';
import {SharedEmployeeModule} from '../shared/employee/shared-employee.module';
import {CreateEmployeeComponent} from './components/create-employee/create-employee.component';
import {ViewEmployeeComponent} from './components/view-employee/view-employee.component';
import {ContactInfoComponent} from './components/view-employee/contact-info/contact-info.component';
import {DecryptButtonComponent} from './components/view-employee/contact-info/decrypt-button/decrypt-button.component';
import {EmailMenuComponent} from './components/view-employee/contact-info/email-menu/email-menu.component';
import {PhoneMenuComponent} from './components/view-employee/contact-info/phone-menu/phone-menu.component';
import {SharedModule} from '../shared/shared.module';
import {AmountsOwedComponent} from './components/view-employee/amounts-owed/amounts-owed.component';
import {TransformNumPipe} from './pipes/transform-num.pipe';
import {PaymentsComponent} from './components/view-employee/payments/payments.component';
import {DecryptService} from './services/decrypt.service';
import {StatusComponent} from './components/view-employee/status/status.component';
import {TagsComponent} from './components/view-employee/tags/tags.component';
import {TaxExemptionsComponent} from './components/view-employee/tax-exemptions/tax-exemptions.component';
import {EmployeeEnumsResolver} from './services/employee-enums.resolver';
import {SettlementStatesResolver} from './services/settlement-states.resolver';
import {EmployeeStatusResolver} from './services/employee-status.resolver';
import {EditEmployeeComponent} from './components/edit-employee/edit-employee.component';

@NgModule({
  imports: [
    SharedModule,
    EmployeesMaterialModule,
    EmployeesRoutingModule,
    SharedEmployeeModule,
    DynamicFormModule,
    VsTableModule,
  ],
  declarations: [
    EmployeesListComponent,
    CreateEmployeeComponent,
    ViewEmployeeComponent,
    ContactInfoComponent,
    DecryptButtonComponent,
    EmailMenuComponent,
    PhoneMenuComponent,
    AmountsOwedComponent,
    StatusComponent,
    TagsComponent,
    TaxExemptionsComponent,
    PaymentsComponent,
    TransformNumPipe,
    EditEmployeeComponent,
  ],
  providers: [
    EmployeeEnumsResolver,
    SettlementStatesResolver,
    EmployeeStatusResolver,
    DecryptService,
  ]
})
export class EmployeesModule { }
