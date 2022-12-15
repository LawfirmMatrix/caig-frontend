import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';
import {StateTaxComponent} from './components/state-tax/state-tax.component';
import {NoContentComponent} from './components/no-content/no-content.component';
import {ReportsComponent} from './components/reports/reports.component';
import {AllPaymentsDetailComponent} from './components/all-payments-detail/all-payments-detail.component';

export const reportsList: Routes = [
  {
    path: 'state-tax-report',
    component: StateTaxComponent,
    data: { animation: 'state-tax', hasSsn: true },
  },
  {
    path: 'gross-wages-and-withholdings-by-state-and-settlement',
    component: NoContentComponent,
    data: { animation: 'x-by-state-and-settlement' },
  },
  {
    path: 'withholdings-by-date-and-settlement',
    component: NoContentComponent,
    data: { animation: 'x-by-date-and-settlement' },
  },
  {
    path: 'gross-wages-and-withholdings-by-payroll-date',
    component: NoContentComponent,
    data: { animation: 'gross-wages-and-withholdings-by-payroll-date' },
  },
  {
    path: 'all-payments-details',
    component: AllPaymentsDetailComponent,
    data: { animation: 'all-payments', hasSsn: true },
  },
  {
    path: 'settlement-status-details',
    component: NoContentComponent,
    data: { animation: 'settlement-status-details' },
  },
  {
    path: '1099-and-w2-information',
    component: TaxInfoComponent,
    data: { animation: 'tax-info', hasSsn: true },
  },
  {
    path: 'user-activity-report',
    component: NoContentComponent,
    data: { animation: 'user-activity-report' },
  },
  {
    path: 'employee-confirmation-status',
    component: NoContentComponent,
    data: { animation: 'employee-confirmation-status' },
  },
  {
    path: 'employee-history',
    component: NoContentComponent,
    data: { animation: 'employee-history' },
  },
  {
    path: 'employee-locations',
    component: NoContentComponent,
    data: { animation: 'employee-history', isMap: true },
  },
  {
    path: 'employee-confirmation-status-by-location',
    component: NoContentComponent,
    data: { animation: 'employee-confirmation-status-by-location', isMap: true },
  },
  {
    path: 'union-membership-status-by-location',
    component: NoContentComponent,
    data: { animation: 'union-membership-status-by-location', isMap: true },
  },
];

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      { path: '', component: ReportsListComponent },
      ...reportsList,
    ],
  },
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ReportsRoutingModule { }
