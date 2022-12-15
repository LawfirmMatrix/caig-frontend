import {NgModule} from '@angular/core';
import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsMaterialModule} from './reports-material.module';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {SharedModule} from '../shared/shared.module';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';
import {VsTableModule} from 'vs-table';
import {DynamicFormModule} from 'dynamic-form';
import {StateTaxComponent} from './components/state-tax/state-tax.component';
import {NoContentComponent} from './components/no-content/no-content.component';
import {ReportsComponent} from './components/reports/reports.component';
import {TreeViewerModule} from 'tree-viewer';
import {AllPaymentsDetailComponent} from './components/all-payments-detail/all-payments-detail.component';

@NgModule({
  imports: [
    ReportsRoutingModule,
    ReportsMaterialModule,
    SharedModule,
    VsTableModule,
    DynamicFormModule,
    TreeViewerModule,
  ],
  declarations: [
    NoContentComponent,


    ReportsComponent,
    ReportsListComponent,
    TaxInfoComponent,
    StateTaxComponent,
    AllPaymentsDetailComponent,
  ],
})
export class ReportsModule { }
