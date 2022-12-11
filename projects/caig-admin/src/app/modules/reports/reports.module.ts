import {NgModule} from '@angular/core';
import {ReportsRoutingModule} from './reports-routing.module';
import {ReportsMaterialModule} from './reports-material.module';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {SharedModule} from '../shared/shared.module';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';
import {VsTableModule} from 'vs-table';
import {DynamicFormModule} from 'dynamic-form';

@NgModule({
  imports: [
    ReportsRoutingModule,
    ReportsMaterialModule,
    SharedModule,
    VsTableModule,
    DynamicFormModule,
  ],
  declarations: [
    ReportsListComponent,
    TaxInfoComponent,
  ],
})
export class ReportsModule { }
