import {NgModule} from '@angular/core';
import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsMaterialModule} from './reports-material.module';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {SharedModule} from '../shared/shared.module';
import {VsTableModule} from 'vs-table';
import {DynamicFormModule} from 'dynamic-form';
import {NoContentComponent} from './components/no-content/no-content.component';
import {ReportsComponent} from './components/reports/reports.component';
import {TreeViewerModule} from 'tree-viewer';
import {EmployeeLocationsComponent} from './components/employee-locations/employee-locations.component';
import {WorldMapModule} from '../shared/world-map/world-map.module';
import {PaymentsAndTaxesComponent} from "./components/payment-and-taxes/payments-and-taxes.component";

@NgModule({
  imports: [
    ReportsRoutingModule,
    ReportsMaterialModule,
    SharedModule,
    VsTableModule,
    DynamicFormModule,
    TreeViewerModule,
    WorldMapModule,
  ],
  declarations: [
    NoContentComponent,


    ReportsComponent,
    ReportsListComponent,
    EmployeeLocationsComponent,
    PaymentsAndTaxesComponent,
  ],
})
export class ReportsModule { }
