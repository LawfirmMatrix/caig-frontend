import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsListComponent} from './components/reports-list/reports-list.component';
import {TaxInfoComponent} from './components/tax-info/tax-info.component';

export const reportsList: Routes = [
  {
    path: '1099-and-w2-information',
    component: TaxInfoComponent,
    data: { animation: 'tax-info' },
  }
];

const routes: Routes = [
  {
    path: '',
    component: ReportsListComponent,
  },
  ...reportsList,
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ],
})
export class ReportsRoutingModule { }
