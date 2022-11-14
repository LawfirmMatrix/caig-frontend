import {
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  Type,
  ViewContainerRef
} from '@angular/core';
import {RespondentsList} from '../components/respondents-list/respondents-list';
import {Survey} from '../../../models/survey.model';
import {HazardPayComponent} from '../components/respondents-list/surveys/hazard-pay.component';
import {NageVaTriageComponent} from '../components/respondents-list/surveys/nage-va-triage.component';
import {LiunaVaComponent} from '../components/respondents-list/surveys/liuna-va.component';
import {NoSurveyComponent} from '../components/respondents-list/surveys/no-survey.component';
import {Nffe178ApgComponent} from '../components/respondents-list/surveys/nffe-178-apg.component';

const componentMapper: ComponentMap = {
  2: NageVaTriageComponent,
  3: HazardPayComponent,
  4: LiunaVaComponent,
  5: Nffe178ApgComponent,
};

@Directive({selector: '[respondentsList]'})
export class RespondentsListDirective implements OnChanges, OnDestroy {
  @Input() public survey!: Survey;
  public componentRef: ComponentRef<RespondentsList | NoSurveyComponent> | undefined;
  constructor(private container: ViewContainerRef) { }
  public ngOnChanges(changes: SimpleChanges) {
    if (this.survey && componentMapper[this.survey.schemaId]) {
      this.componentRef = this.container.createComponent(componentMapper[this.survey.schemaId]);
      (this.componentRef.instance as RespondentsList).survey = this.survey;
    } else {
      this.componentRef = this.container.createComponent(NoSurveyComponent);
    }
  }
  public ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}

interface ComponentMap {
  [schemaId: number]: Type<RespondentsList>;
}
