import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {EventsComponent} from './component/events/events.component';
import {EventsFiltersResolver} from './events-filters.resolver';

const routes: Routes = [
  { path: '', component: EventsComponent, resolve: { filters: EventsFiltersResolver } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }
