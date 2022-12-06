import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettlementsListComponent} from './components/settlements-list/settlements-list.component';
import {EditSettlementComponent} from './components/edit-settlement/edit-settlement.component';
import {AllSettlementsResolver} from './services/all-settlements.resolver';
import {SingleSettlementResolver} from './services/single-settlement.resolver';

const routes: Routes = [
  {
    path: '',
    component: SettlementsListComponent,
    resolve: { settlements: AllSettlementsResolver },
    data: { animation: 'settlement-list' },
  },
  {
    path: ':id',
    component: EditSettlementComponent,
    resolve: { settlement: SingleSettlementResolver },
    data: { animation: 'settlement' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettlementsRoutingModule { }
