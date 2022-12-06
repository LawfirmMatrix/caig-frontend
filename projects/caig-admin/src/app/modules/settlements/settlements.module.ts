import {NgModule} from '@angular/core';
import {SettlementsMaterialModule} from './settlements-material.module';
import {SettlementsRoutingModule} from './settlements-routing.module';
import {SettlementsListComponent} from './components/settlements-list/settlements-list.component';
import {VsTableModule} from 'vs-table';
import {CommonModule} from '@angular/common';
import {EditSettlementComponent} from './components/edit-settlement/edit-settlement.component';
import {SharedComponentsModule} from 'shared-components';
import {ViewSettlementComponent} from './components/view-settlement/view-settlement.component';

@NgModule({
  imports: [
    SettlementsMaterialModule,
    SettlementsRoutingModule,
    VsTableModule,
    CommonModule,
    SharedComponentsModule,
  ],
  declarations: [
    SettlementsListComponent,
    EditSettlementComponent,
    ViewSettlementComponent,
  ],
})
export class SettlementsModule { }
