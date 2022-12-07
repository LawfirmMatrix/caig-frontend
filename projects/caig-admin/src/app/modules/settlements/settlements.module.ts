import {NgModule} from '@angular/core';
import {SettlementsMaterialModule} from './settlements-material.module';
import {SettlementsRoutingModule} from './settlements-routing.module';
import {SettlementsListComponent} from './components/settlements-list/settlements-list.component';
import {VsTableModule} from 'vs-table';
import {EditSettlementComponent} from './components/edit-settlement/edit-settlement.component';
import {SharedComponentsModule} from 'shared-components';
import {ViewSettlementComponent} from './components/view-settlement/view-settlement.component';
import {SharedModule} from '../shared/shared.module';
import {PipesModule} from 'pipes';
import {DynamicFormModule} from 'dynamic-form';

@NgModule({
  imports: [
    SettlementsMaterialModule,
    SettlementsRoutingModule,
    VsTableModule,
    SharedComponentsModule,
    SharedModule,
    PipesModule,
    DynamicFormModule,
  ],
  declarations: [
    SettlementsListComponent,
    EditSettlementComponent,
    ViewSettlementComponent,
  ],
})
export class SettlementsModule { }
