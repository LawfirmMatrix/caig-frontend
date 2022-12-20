import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {NoContentComponent} from './components/no-content/no-content.component';
import {ReportsComponent} from './components/reports/reports.component';
import {EmployeeLocationsComponent} from './components/employee-locations/employee-locations.component';
import {PaymentsAndTaxesComponent} from "./components/payment-and-taxes/payments-and-taxes.component";

export const reportsList: Routes = [
  {
    path: 'payments-and-taxes',
    component: PaymentsAndTaxesComponent,
    data: { animation: 'payments-and-taxes', hasSsn: true },
  },
  // {
  //   path: 'state-tax-report',
  //   component: StateTaxComponent,
  //   data: { animation: 'state-tax', hasSsn: true },
  // },
  {
    path: 'gross-wages-and-withholdings-by-state-and-settlement',
    component: NoContentComponent,
    data: { animation: 'x-by-state-and-settlement', disabled: true },
  },
  {
    path: 'withholdings-by-date-and-settlement',
    component: NoContentComponent,
    data: { animation: 'x-by-date-and-settlement', disabled: true },
  },
  {
    path: 'gross-wages-and-withholdings-by-payroll-date',
    component: NoContentComponent,
    data: { animation: 'gross-wages-and-withholdings-by-payroll-date', disabled: true },
  },
  // {
  //   path: 'all-payments-details',
  //   component: AllPaymentsDetailComponent,
  //   data: { animation: 'all-payments', hasSsn: true },
  // },
  {
    path: 'settlement-status-details',
    component: NoContentComponent,
    data: { animation: 'settlement-status-details', disabled: true },
  },
  // {
  //   path: '1099-and-w2-information',
  //   component: TaxInfoComponent,
  //   data: { animation: 'tax-info', hasSsn: true },
  // },
  {
    path: 'user-activity-report',
    component: NoContentComponent,
    data: { animation: 'user-activity-report', disabled: true },
  },
  {
    path: 'employee-confirmation-status',
    component: NoContentComponent,
    data: { animation: 'employee-confirmation-status', disabled: true },
  },
  {
    path: 'employee-history',
    component: NoContentComponent,
    data: { animation: 'employee-history', disabled: true },
  },
  {
    path: 'employee-locations',
    component: EmployeeLocationsComponent,
    data: { animation: 'employee-history', isMap: true, disabled: true },
  },
  {
    path: 'employee-confirmation-status-by-location',
    component: EmployeeLocationsComponent,
    data: { animation: 'employee-confirmation-status-by-location', isMap: true, disabled: true },
  },
  {
    path: 'union-membership-status-by-location',
    component: EmployeeLocationsComponent,
    data: { animation: 'union-membership-status-by-location', isMap: true, disabled: true },
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
