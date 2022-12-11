import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {NavigationComponent} from './core/components/navigation/navigation.component';
import {AuthGuard} from './auth/services/guards/auth.guard';
import {HomeComponent} from './core/components/home/home.component';
import {LoginComponent} from './auth/login/login.component';
import {NoAuthGuard} from './auth/services/guards/no-auth.guard';
import {CheckForUpdatesResolver} from './check-for-updates.resolver';
import {SessionResolver} from './session.resolver';
import {CaigSurveyPortalGuard} from './core/guards/caig-survey-portal.guard';
import {AdminGuard} from './core/guards/admin-guard';
import {CaigCallCenterPortalGuard} from './core/guards/caig-call-center-portal.guard';
import {CallCenterPortalGuard} from './core/guards/call-center-portal.guard';
import {SurveyPortalGuard} from './core/guards/survey-portal.guard';
import {CaigPortalGuard} from './core/guards/caig-portal.guard';

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
            canActivate: [ CaigSurveyPortalGuard ],
          },
          {
            path: 'call-list',
            loadChildren: () => import('./modules/call-list/call-list.module').then(m => m.CallListModule),
            data: { animation: 'call-list' },
            canActivate: [ CallCenterPortalGuard ],
          },
          {
            path: 'events',
            loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule),
            data: { animation: 'events' },
            canActivate: [ CaigCallCenterPortalGuard ],
          },
          {
            path: 'users',
            loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
            data: { animation: 'users' },
            canLoad: [ AdminGuard ],
          },
          {
            path: 'surveys',
            loadChildren: () => import('./modules/surveys/surveys.module').then(m => m.SurveysModule),
            data: { animation: 'surveys' },
            canActivate: [ SurveyPortalGuard ],
          },
          {
            path: 'payrolls',
            loadChildren: () => import('./modules/payrolls/payrolls.module').then(m => m.PayrollsModule),
            data: { animation: 'payrolls' },
            canActivate: [ CaigPortalGuard ],
          },
          {
            path: 'settlements',
            loadChildren: () => import('./modules/settlements/settlements.module').then(m => m.SettlementsModule),
            data: { animation: 'settlements' },
            canActivate: [ CaigPortalGuard ],
          },
          {
            path: 'reports',
            loadChildren: () => import('./modules/reports/reports.module').then(m => m.ReportsModule),
            data: { animation: 'reports' },
            canActivate: [ CaigPortalGuard ],
          }
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
