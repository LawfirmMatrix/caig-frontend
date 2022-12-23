import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {NoContentComponent} from './components/no-content/no-content.component';
import {ReportsComponent} from './components/reports/reports.component';
import {EmployeeLocationsComponent} from './components/employee-locations/employee-locations.component';
import {StateTaxComponent} from './components/state-tax/state-tax.component';
import {AllPaymentsDetailComponent} from './components/all-payments-detail/all-payments-detail.component';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';

export const reportsList: Routes = [
  {
    path: 'state-tax-report',
    component: StateTaxComponent,
    data: { hasSsn: true },
  },
  {
    path: 'gross-wages-and-withholdings-by-state-and-settlement',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'withholdings-by-date-and-settlement',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'gross-wages-and-withholdings-by-payroll-date',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'all-payments-details-summary',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'all-payments-details-by-employee',
    component: AllPaymentsDetailComponent,
    data: { hasSsn: true },
  },
  {
    path: 'all-payments-details-sequence',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'settlement-status-details',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: '1099-and-w2-information',
    component: TaxInfoComponent,
    data: { hasSsn: true },
  },
  {
    path: 'user-activity-report',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'employee-confirmation-status',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'employee-history',
    component: NoContentComponent,
    data: { disabled: true },
  },
  {
    path: 'employee-locations',
    component: EmployeeLocationsComponent,
    data: { isMap: true, disabled: true },
  },
  {
    path: 'employee-confirmation-status-by-location',
    component: EmployeeLocationsComponent,
    data: { isMap: true, disabled: true },
  },
  {
    path: 'union-membership-status-by-location',
    component: EmployeeLocationsComponent,
    data: { isMap: true, disabled: true },
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
