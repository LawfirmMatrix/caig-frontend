import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettlementsListComponent} from './components/settlements-list/settlements-list.component';
import {EditSettlementComponent} from './components/edit-settlement/edit-settlement.component';
import {AllSettlementsResolver} from './services/all-settlements.resolver';
import {SingleSettlementResolver} from './services/single-settlement.resolver';
import {ViewSettlementComponent} from './components/view-settlement/view-settlement.component';

const routes: Routes = [
  {
    path: '',
    component: SettlementsListComponent,
    resolve: { settlements: AllSettlementsResolver },
    data: { animation: 'settlement-list' },
  },
  {
    path: ':id/view',
    component: ViewSettlementComponent,
    data: { animation: 'settlement-view' },
    resolve: { settlement: SingleSettlementResolver },
  },
  {
    path: ':id/edit',
    component: EditSettlementComponent,
    data: { animation: 'settlement-edit' },
    resolve: { settlement: SingleSettlementResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettlementsRoutingModule { }
