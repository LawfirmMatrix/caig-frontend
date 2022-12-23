import {NgModule} from '@angular/core';
import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsMaterialModule} from './reports-material.module';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {SharedModule} from '../shared/shared.module';
import {VsTableModule} from 'vs-table';
import {DynamicFormModule} from 'dynamic-form';
import {NoContentComponent} from './components/no-content/no-content.component';
import {ReportsComponent} from './components/reports/reports.component';
import {EmployeeLocationsComponent} from './components/employee-locations/employee-locations.component';
import {WorldMapModule} from '../shared/world-map/world-map.module';
import {StateTaxComponent} from './components/state-tax/state-tax.component';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';
import {AllPaymentsDetailComponent} from './components/all-payments-detail/all-payments-detail.component';
import {VsTreeViewerModule} from 'vs-tree-viewer';

@NgModule({
  imports: [
    ReportsRoutingModule,
    ReportsMaterialModule,
    SharedModule,
    VsTableModule,
    DynamicFormModule,
    VsTreeViewerModule,
    WorldMapModule,
  ],
  declarations: [
    NoContentComponent,


    ReportsComponent,
    ReportsListComponent,
    EmployeeLocationsComponent,
    StateTaxComponent,
    TaxInfoComponent,
    AllPaymentsDetailComponent,
  ],
})
export class ReportsModule { }
