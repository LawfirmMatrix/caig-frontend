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
import {RespondentsListDirective} from './directives/respondents-list.directive';
import {EditNotesComponent} from './components/edit-notes/edit-notes.component';
import {ColumnConfigService} from './components/respondents-list/column-config.service';
import {HazardPayComponent} from './components/respondents-list/surveys/hazard-pay.component';
import {DynamicFormModule} from 'dynamic-form';
import {LiunaVaComponent} from './components/respondents-list/surveys/liuna-va.component';
import {NageVaTriageComponent} from './components/respondents-list/surveys/nage-va-triage.component';
import {NoSurveyComponent} from './components/respondents-list/surveys/no-survey.component';
import {EmployeeInfoComponent} from './components/employee-info/employee-info.component';

@NgModule({
  imports: [
    SurveysRoutingModule,
    SurveysMaterialModule,
    FlexLayoutModule,
    VsTableModule,
    CommonModule,
    DynamicFormModule,
  ],
  declarations: [
    SurveysListComponent,
    RespondentsListComponent,
    LinkRespondentComponent,
    RespondentsListDirective,
    EditNotesComponent,
    HazardPayComponent,
    LiunaVaComponent,
    NageVaTriageComponent,
    NoSurveyComponent,
    EmployeeInfoComponent,
  ],
  providers: [
    AllSurveysResolver,
    ColumnConfigService,
  ]
})
export class SurveysModule { }
