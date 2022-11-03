import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SurveysListComponent} from './components/surveys-list/surveys-list.component';
import {RespondentsListComponent} from './components/respondents-list/respondents-list.component';

const routes: Routes = [
  { path: '', component: SurveysListComponent },
  { path: ':id', component: RespondentsListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SurveysRoutingModule { }
