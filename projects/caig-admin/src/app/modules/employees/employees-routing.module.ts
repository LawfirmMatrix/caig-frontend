import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeesListComponent} from './components/employees-list/employees-list.component';
import {CreateEmployeeComponent} from './components/create-employee/create-employee.component';
import {ViewEmployeeComponent} from './components/view-employee/view-employee.component';
import {AllEmployeesResolver} from './services/all-employees.resolver';
import {EmployeeEnumsResolver} from './services/employee-enums.resolver';
import {EmployeeStatusResolver} from './services/employee-status.resolver';
import {SettlementStatesResolver} from './services/settlement-states.resolver';
import {SettlementUsersResolver} from '../shared/employee/service/settlement-users.resolver';
import {EditEmployeeComponent} from './components/edit-employee/edit-employee.component';
import {UnsavedChangesGuard} from '../shared/employee/service/unsaved-changes.guard';

const employeesRoutes: Routes = [
  {
    path: '',
    component: EmployeesListComponent,
    resolve: {
      loadStates: SettlementStatesResolver,
      loadEnums: EmployeeEnumsResolver,
      loadUsers: SettlementUsersResolver,
      loadAllEmployees: AllEmployeesResolver,
      loadEmployeeStatuses: EmployeeStatusResolver,
    }
  },
  {
    path: ':id/edit',
    component: EditEmployeeComponent,
    data: { animation: 'edit' },
    canDeactivate: [ UnsavedChangesGuard ],
    resolve: {
      loadStates: SettlementStatesResolver,
      loadEnums: EmployeeEnumsResolver,
      loadUsers: SettlementUsersResolver,
      loadAllEmployees: AllEmployeesResolver,
      loadEmployeeStatuses: EmployeeStatusResolver,
    }
  },
  {
    path: ':id/view',
    data: { animation: 'view' },
    component: ViewEmployeeComponent,
    resolve: {
      loadAllEmployees: AllEmployeesResolver,
      loadEmployeeStatuses: EmployeeStatusResolver,
    }
  },
  {
    path: 'new',
    data: { animation: 'new' },
    component: CreateEmployeeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(employeesRoutes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
