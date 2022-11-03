import {NgModule} from '@angular/core';
import {SurveysRoutingModule} from './surveys-routing.module';
import {SurveysListComponent} from './components/surveys-list/surveys-list.component';
import {SurveysMaterialModule} from './surveys-material.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VsTableModule} from 'vs-table';
import {CommonModule} from '@angular/common';
import {RespondentsListComponent} from './components/respondents-list/respondents-list.component';

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
  ],
})
export class SurveysModule { }
