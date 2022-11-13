import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SurveysListComponent} from './components/surveys-list/surveys-list.component';
import {RespondentsListComponent} from './components/respondents-list/respondents-list.component';
import {LinkRespondentComponent} from './components/link-respondent/link-respondent.component';
import {AllSurveysResolver} from './services/all-surveys.resolver';
import {AllEmployeesResolver} from '../employees/services/all-employees.resolver';

const routes: Routes = [
  {
    path: 'link',
    pathMatch: 'full',
    redirectTo: '/',
  },
  {
    path: 'link/:respondentId',
    component: LinkRespondentComponent,
    resolve: { employees: AllEmployeesResolver },
  },
  {
    path: '',
    resolve: { surveys: AllSurveysResolver },
    children: [
      { path: '', component: SurveysListComponent },
      { path: ':surveyId', component: RespondentsListComponent },
      { path: ':surveyId/:locationId', component: RespondentsListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveysRoutingModule { }
