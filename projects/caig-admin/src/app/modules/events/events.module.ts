import {NgModule} from '@angular/core';
import {EventsMaterialModule} from './events-material.module';
import {EventsRoutingModule} from './events-routing.module';
import {EventsComponent} from './component/events/events.component';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DynamicFormModule} from 'dynamic-form';
import {VsTableModule} from 'vs-table';

@NgModule({
  imports: [
    CommonModule,
    EventsMaterialModule,
    EventsRoutingModule,
    VsTableModule,
    FlexLayoutModule,
    DynamicFormModule,
  ],
  declarations: [
    EventsComponent,
  ],
})
export class EventsModule { }
