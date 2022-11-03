import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TakeSurveyComponent} from './survey/components/take-survey/take-survey.component';
import {SelectSurveyComponent} from './survey/components/select-survey/select-survey.component';
import {BackdropComponent} from './survey/components/backdrop/backdrop.component';
import {InitializeResolver} from './survey/initialize-resolver';
import {MultipleLocationsGuard} from './survey/guards/multiple-locations.guard';
import {ShortcutRedirectGuard} from './survey/guards/shortcut-redirect.guard';
import {ValidSurveyGuard} from './survey/guards/valid-survey.guard';
import {ValidLocationGuard} from './survey/guards/valid-location.guard';

const routes: Routes = [
  {
    path: '',
    component: BackdropComponent,
    resolve: { survey: InitializeResolver },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SelectSurveyComponent,
        canActivate: [ MultipleLocationsGuard ],
      },
      {
        path: ':shortcut',
        component: SelectSurveyComponent,
        canActivate: [ ShortcutRedirectGuard ],
      },
      {
        path: 'survey/:surveyId',
        component: TakeSurveyComponent,
        canActivate: [ ValidSurveyGuard ],
      },
      {
        path: 'survey/:surveyId/:locationId',
        component: TakeSurveyComponent,
        canActivate: [ ValidLocationGuard ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
