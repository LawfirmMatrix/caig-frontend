import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {TakeSurveyComponent} from './survey/components/take-survey/take-survey.component';
import {SelectSurveyComponent} from './survey/components/select-survey/select-survey.component';
import {MultipleLocationsGuard} from './multiple-locations.guard';
import {LocationParserGuard} from './location-parser.guard';
import {BackdropComponent} from './survey/components/backdrop/backdrop.component';

const routes: Routes = [
  {
    path: '',
    component: BackdropComponent,
    children: [
      {
        path: '',
        component: SelectSurveyComponent,
        canActivate: [ MultipleLocationsGuard ],
      },
      {
        path: ':location',
        component: SelectSurveyComponent,
        canActivate: [ LocationParserGuard ],
      },
      {
        path: 'survey/:id',
        component: TakeSurveyComponent,
        data: { showLocation: true }
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
