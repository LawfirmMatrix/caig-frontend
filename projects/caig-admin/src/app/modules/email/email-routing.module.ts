import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EmployeeResolver} from './services/employee-resolver';
import {ComposeEmailComponent} from './components/compose-email/compose-email.component';
import {BatchResolver} from './services/batch-resolver';
import {BatchEmailComponent} from './components/batch-email/batch-email.component';
import {EmailPreviewComponent} from './components/email-preview/email-preview.component';

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
  },
  {
    path: ':employeeId',
    data: { animation: 'email' },
    resolve: { employee: EmployeeResolver },
    children: [
      {
        path: 'email',
        component: ComposeEmailComponent,
        data: { animation: 'email' },
      },
      {
        path: 'email/preview',
        component: EmailPreviewComponent,
        data: { animation: 'preview' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmailRoutingModule { }
