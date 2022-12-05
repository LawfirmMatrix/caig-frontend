import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeResolver} from './services/employee-resolver';
import {ComposeEmailComponent} from './components/compose-email/compose-email.component';
import {BatchResolver} from './services/batch-resolver';
import {BatchEmailComponent} from './components/batch-email/batch-email.component';
import {CaigPortalGuard} from '../../core/guards/caig-portal.guard';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/',
  },
  {
    path: ':employeeId',
    pathMatch: 'full',
    redirectTo: '/',
  },
  {
    path: 'batch-email/:batchId',
    data: {animation: 'batchEmail'},
    resolve: { employees: BatchResolver },
    component: BatchEmailComponent,
    canActivate: [ CaigPortalGuard ],
  },
  {
    path: ':employeeId',
    data: { animation: 'email' },
    resolve: { employee: EmployeeResolver },
    children: [
      { path: 'email', component: ComposeEmailComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRoutingModule { }
