import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NavigationComponent} from './core/components/navigation/navigation.component';
import {AuthGuard} from './auth/services/guards/auth.guard';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {NoAuthGuard} from './auth/services/guards/no-auth.guard';
import {CheckForUpdatesResolver} from './check-for-updates.resolver';
import {SessionResolver} from './session.resolver';
import {CaigPortalGuard} from './caig-portal.guard';
import {AdminGuard} from './admin-guard';

export const loginRoute = 'login';

const routes: Routes = [
  {
    path: '',
    resolve: {
      checkForUpdates: CheckForUpdatesResolver,
    },
    children: [
      {
        path: '',
        component: NavigationComponent,
        resolve: {
          user: SessionResolver,
        },
        canActivate: [ AuthGuard ],
        canActivateChild: [ AuthGuard ],
        children: [
          {
            path: '',
            component: HomeComponent,
            data: { animation: 'home' },
          },
          {
            path: 'employees',
            loadChildren: () => import('./modules/employees/employees.module').then(m => m.EmployeesModule),
            data: { animation: 'employees' },
            canActivate: [ CaigPortalGuard ],
          },
          {
            path: 'call-list',
            loadChildren: () => import('./modules/call-list/call-list.module').then(m => m.CallListModule),
            data: { animation: 'call-list' },
          },
          {
            path: 'events',
            loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule),
            data: { animation: 'events' },
          },
          {
            path: 'users',
            loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
            data: { animation: 'users' },
            canLoad: [ AdminGuard ],
          },
        ],
      },
      {
        path: loginRoute,
        component: LoginComponent,
        canActivate: [ NoAuthGuard ]
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
