import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeesListComponent} from './components/employees-list/employees-list.component';
import {ViewEmployeeComponent} from './components/view-employee/view-employee.component';
import {EditEmployeeComponent} from './components/edit-employee/edit-employee.component';
import {SingleEmployeeResolver} from './services/single-employee.resolver';
import {AllEmployeesResolver} from './services/all-employees.resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { employees: AllEmployeesResolver },
    component: EmployeesListComponent,
  },
  {
    path: ':id',
    resolve: { employee: SingleEmployeeResolver },
    children: [
      {
        path: '',
        component: ViewEmployeeComponent,
      },
      {
        path: 'edit',
        component: EditEmployeeComponent,
      }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule { }
