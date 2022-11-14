import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UsersComponent} from './component/users/users.component';
import {EditUserComponent} from './component/edit-user/edit-user.component';
import {UsersResolver} from './services/users.resolver';
import {UserRolesResolver} from './services/user-roles.resolver';

const usersRoutes: Routes = [
  {path: '', component: UsersComponent, resolve: { loadUsers: UsersResolver }},
  {path: 'create', component: EditUserComponent, resolve: { roles: UserRolesResolver }},
  {path: ':id', component: EditUserComponent, resolve: { roles: UserRolesResolver }},
];

@NgModule({
  imports: [RouterModule.forChild(usersRoutes)],
  exports: [RouterModule],
})
export class UsersRoutingModule { }
