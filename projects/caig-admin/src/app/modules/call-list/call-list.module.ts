import {NgModule} from '@angular/core';
import {CallListComponent} from './component/call-list/call-list.component';
import {CallListMaterialModule} from './call-list-material.module';
import {CallListRoutingModule} from './call-list-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {CommonModule} from '@angular/common';
import {EmployeeViewComponent} from './component/employee-view/employee-view.component';
import {DynamicFormModule} from 'dynamic-form';
import {SharedEmployeeModule} from '../shared/employee/shared-employee.module';
import {VsTableModule} from 'vs-table';
import {EmployeeViewResolver} from './service/employee-view.resolver';
import {CallListResolver} from './service/call-list.resolver';
import {BueLocationsResolver} from './service/bue-locations.resolver';

@NgModule({
  imports: [
    CallListMaterialModule,
    CallListRoutingModule,
    FlexLayoutModule,
    CommonModule,
    SharedEmployeeModule,
    DynamicFormModule,
    VsTableModule,
  ],
  declarations: [
    CallListComponent,
    EmployeeViewComponent,
  ],
  providers: [
    CallListResolver,
    EmployeeViewResolver,
    BueLocationsResolver,
  ],
})
export class CallListModule { }
