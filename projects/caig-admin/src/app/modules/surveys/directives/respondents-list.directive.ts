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

const componentMapper: ComponentMap = {
  // 2: NageVaTriageComponent,
  3: HazardPayComponent,
  // 4: LiunaVaComponent,
};

@Directive({selector: '[respondentsList]'})
export class RespondentsListDirective implements OnChanges, OnDestroy {
  @Input() public survey!: Survey;
  public componentRef: ComponentRef<RespondentsList> | undefined;
  constructor(private container: ViewContainerRef) { }
  public ngOnChanges(changes: SimpleChanges) {
    if (this.survey && componentMapper[this.survey.schemaId]) {
      this.componentRef = this.container.createComponent(componentMapper[this.survey.schemaId]);
      this.componentRef.instance.survey = this.survey;
    }
  }
  public ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}

interface ComponentMap {
  [schemaId: number]: Type<RespondentsList>;
}
