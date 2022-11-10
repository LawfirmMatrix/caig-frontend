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
import {RespondentsList} from '../components/respondents-list/surveys/respondents-list';

const componentMapper: ComponentMap = {
  // 2: NageVaTriageComponent,
  // 3: HazardPayComponent,
  // 4: LiunaVaComponent,
};

@Directive({selector: '[respondentsList]'})
export class RespondentsListDirective implements OnChanges, OnDestroy {
  @Input() public schemaId!: number;
  public componentRef: ComponentRef<RespondentsList> | undefined;
  constructor(private container: ViewContainerRef) { }
  public ngOnChanges(changes: SimpleChanges) {
    if (this.schemaId && componentMapper[this.schemaId]) {
      this.componentRef = this.container.createComponent(componentMapper[this.schemaId]);
    }
  }
  public ngOnDestroy(): void {
    this.componentRef?.destroy();
  }
}

interface ComponentMap {
  [schemaId: number]: Type<RespondentsList>;
}
