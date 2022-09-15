import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SurveyComponent} from './survey/survey.component';

const routes: Routes = [
  { path: '', component: SurveyComponent },
  { path: ':location', component: SurveyComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
