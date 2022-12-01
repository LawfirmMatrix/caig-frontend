import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CallListComponent} from './component/call-list/call-list.component';
import {EmployeeViewComponent} from './component/employee-view/employee-view.component';
import {UnsavedChangesGuard} from '../shared/employee/service/unsaved-changes.guard';
import {EmployeeViewResolver} from './service/employee-view.resolver';
import {CallListResolver} from './service/call-list.resolver';
import {BueLocationsResolver} from './service/bue-locations.resolver';
import {SettlementUsersResolver} from '../shared/employee/service/settlement-users.resolver';

const routes: Routes = [
  {
    path: '',
    component: CallListComponent,
    resolve: {
      bueLocations: BueLocationsResolver,
      loadAllEmployees: CallListResolver,
      loadUsers: SettlementUsersResolver,
    }
  },
  {
    path: ':id/view',
    component: EmployeeViewComponent,
    data: { animation: 'employee-view' },
    canDeactivate: [ UnsavedChangesGuard ],
    resolve: {
      loadEnums: EmployeeViewResolver,
      loadAllEmployees: CallListResolver,
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CallListRoutingModule { }
