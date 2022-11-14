import {NgModule} from '@angular/core';
import {UsersMaterialModule} from './users-material.module';
import {UsersRoutingModule} from './users-routing.module';
import {UsersComponent} from './component/users/users.component';
import {VsTableModule} from 'vs-table';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {EditUserComponent} from './component/edit-user/edit-user.component';
import {DynamicFormModule} from 'dynamic-form';
import {UsersResolver} from './services/users.resolver';
import {UserRolesResolver} from './services/user-roles.resolver';

@NgModule({
  imports: [
    UsersMaterialModule,
    UsersRoutingModule,
    VsTableModule,
    CommonModule,
    FlexLayoutModule,
    DynamicFormModule,
  ],
  declarations: [
    UsersComponent,
    EditUserComponent,
  ],
  providers: [ UsersResolver, UserRolesResolver ],
})
export class UsersModule { }
