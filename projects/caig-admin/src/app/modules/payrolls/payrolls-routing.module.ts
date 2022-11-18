import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PayrollsListComponent} from './components/payrolls-list/payrolls-list.component';
import {PayrollsResolver} from './services/payrolls-resolver';
import {AddToPayrollComponent} from './components/add-to-payroll/add-to-payroll.component';
import {PreviewResolver} from './services/preview-resolver';
import {SinglePayrollResolver} from './services/single-payroll-resolver';
import {ViewPayrollComponent} from './components/view-payroll/view-payroll.component';

const routes: Routes = [
  {
    path: '',
    resolve: { payrolls: PayrollsResolver },
    children: [
      { path: '', component: PayrollsListComponent },
      { path: 'add', component: AddToPayrollComponent },
      {
        path: 'add/:batchId',
        component: AddToPayrollComponent,
        resolve: { preview: PreviewResolver }
      },
      { path: 'view', pathMatch: 'full', redirectTo: '/' },
      {
        path: 'view/:payrollId',
        component: ViewPayrollComponent,
        resolve: { payroll: SinglePayrollResolver },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayrollsRoutingModule { }
