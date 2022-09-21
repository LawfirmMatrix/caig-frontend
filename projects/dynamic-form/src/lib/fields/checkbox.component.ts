import {Component} from '@angular/core';
import {FieldBaseComponent, FieldBase, BaseOptions, ControlType, FieldPosition, LabelPosition} from './field-base';

@Component({
  selector: 'dynamic-form-checkbox',
  template: `
    <div fxFlex [fxLayoutAlign]="field.position + ' center'" [formGroup]="form">
      <mat-checkbox [formControlName]="field.key"
                    [required]="field.required"
                    [labelPosition]="field.labelPosition"
                    [indeterminate]="control.value === null"
                    [color]="field.color">
        <span>{{field.label}}<strong *ngIf="field.required && !control.disabled" class="mat-error">&nbsp;*</strong></span>
      </mat-checkbox>
    </div>
  `,
  styles: [`
    span {
      white-space: normal;
    }
    mat-checkbox {
      height: 42px;
      margin-bottom: 1.34375em;
    }
  `]
})
export class CheckboxComponent extends FieldBaseComponent<CheckboxField> { }

export class CheckboxField extends FieldBase<boolean> {
  public controlType = ControlType.Checkbox;
  public position: FieldPosition;
  public labelPosition: LabelPosition;
  constructor(options: CheckboxOptions) {
    super(options);
    this.position = options.position || 'center';
    this.labelPosition = options.labelPosition || 'after';
  }
}

export interface CheckboxOptions extends BaseOptions<boolean> {
  position?: FieldPosition;
  labelPosition?: LabelPosition;
}
