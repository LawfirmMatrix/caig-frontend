import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';
import {StateTaxComponent} from './components/state-tax/state-tax.component';

export const reportsList: Routes = [
  {
    path: 'state-tax-report',
    component: StateTaxComponent,
    data: { animation: 'state-tax' },
  },
  {
    path: 'gross-wages-and-withholdings-by-state-and-settlement',
    component: StateTaxComponent,
    data: { animation: 'x-by-state-and-settlement' },
  },
  {
    path: 'withholdings-by-date-and-settlement',
    component: StateTaxComponent,
    data: { animation: 'x-by-date-and-settlement' },
  },
  {
    path: 'gross-wages-and-withholdings-by-payroll-date',
    component: StateTaxComponent,
    data: { animation: 'gross-wages-and-withholdings-by-payroll-date' },
  },
  {
    path: 'all-payments',
    component: StateTaxComponent,
    data: { animation: 'all-payments' },
  },
  {
    path: 'settlement-status-details',
    component: StateTaxComponent,
    data: { animation: 'settlement-status-details' },
  },
  {
    path: '1099-and-w2-information',
    component: TaxInfoComponent,
    data: { animation: 'tax-info' },
  },
  {
    path: 'user-activity-report',
    component: StateTaxComponent,
    data: { animation: 'user-activity-report' },
  },
  {
    path: 'employee-confirmation-status',
    component: StateTaxComponent,
    data: { animation: 'employee-confirmation-status' },
  },
  {
    path: 'employee-history',
    component: StateTaxComponent,
    data: { animation: 'employee-history' },
  },
  {
    path: 'employee-locations',
    component: StateTaxComponent,
    data: { animation: 'employee-history', isMap: true },
  },
  {
    path: 'employee-confirmation-status-by-location',
    component: StateTaxComponent,
    data: { animation: 'employee-confirmation-status-by-location', isMap: true },
  },
  {
    path: 'union-membership-status-by-location',
    component: StateTaxComponent,
    data: { animation: 'union-membership-status-by-location', isMap: true },
  },
];

const routes: Routes = [
  { path: '', component: ReportsListComponent },
  ...reportsList,
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ReportsRoutingModule { }
