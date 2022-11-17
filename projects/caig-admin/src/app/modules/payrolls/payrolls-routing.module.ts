import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollsListComponent} from './components/payrolls-list/payrolls-list.component';
import {PayrollsResolver} from './services/payrolls-resolver';
import {AddToPayrollComponent} from './components/add-to-payroll/add-to-payroll.component';
import {PreviewResolver} from './services/preview-resolver';

const routes: Routes = [
  {
    path: '',
    resolve: { payrolls: PayrollsResolver },
    children: [
      { path: '', component: PayrollsListComponent },
      { path: 'add', pathMatch: 'full', redirectTo: '/' },
      {
        path: 'add/:batchId',
        component: AddToPayrollComponent,
        resolve: { preview: PreviewResolver }
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollsRoutingModule { }
