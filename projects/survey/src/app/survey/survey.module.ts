import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SurveyMaterialModule} from './survey-material.module';
import {SelectSurveyComponent} from './components/select-survey/select-survey.component';
import {TakeSurveyComponent} from './components/take-survey/take-survey.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {DynamicFormModule} from 'dynamic-form';

@NgModule({
  imports: [
    CommonModule,
    SurveyMaterialModule,
    FlexLayoutModule,
    DynamicFormModule,
  ],
  declarations: [
    SelectSurveyComponent,
    TakeSurveyComponent,
  ],
})
export class SurveyModule { }
