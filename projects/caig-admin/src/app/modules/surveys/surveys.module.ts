import {NgModule} from '@angular/core';
import {SurveysRoutingModule} from './surveys-routing.module';
import {SurveysListComponent} from './components/surveys-list/surveys-list.component';
import {SurveysMaterialModule} from './surveys-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VsTableModule} from 'vs-table';
import {CommonModule} from '@angular/common';
import {RespondentsListComponent} from './components/respondents-list/respondents-list.component';
import {LinkRespondentComponent} from './components/link-respondent/link-respondent.component';
import {AllSurveysResolver} from './services/all-surveys.resolver';

@NgModule({
  imports: [
    SurveysRoutingModule,
    SurveysMaterialModule,
    FlexLayoutModule,
    VsTableModule,
    CommonModule
  ],
  declarations: [
    SurveysListComponent,
    RespondentsListComponent,
    LinkRespondentComponent,
  ],
  providers: [
    AllSurveysResolver,
  ]
})
export class SurveysModule { }
