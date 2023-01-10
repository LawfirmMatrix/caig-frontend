import {NgModule} from '@angular/core';
import {EmployeesRoutingModule} from './employees-routing.module';
import {EmployeesMaterialModule} from './employees-material.module';
import {EmployeesListComponent} from './components/employees-list/employees-list.component';
import {ViewEmployeeComponent} from './components/view-employee/view-employee.component';
import {EditEmployeeComponent} from './components/edit-employee/edit-employee.component';
import {VsTableModule} from 'vs-table';
import {SharedEmployeeModule} from '../shared/employee/shared-employee.module';
import {SharedModule} from '../shared/shared.module';
import {EmployeesFilterComponent} from './components/employees-filter/employees-filter.component';

@NgModule({
  imports: [
    EmployeesRoutingModule,
    EmployeesMaterialModule,
    SharedModule,
    SharedEmployeeModule,
    VsTableModule,
  ],
  declarations: [
    EmployeesListComponent,
    ViewEmployeeComponent,
    EditEmployeeComponent,
    EmployeesFilterComponent,
  ],
})
export class EmployeesModule { }
