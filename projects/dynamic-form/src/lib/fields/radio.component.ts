import {Component} from '@angular/core';
import {FieldBase, FieldBaseComponent, BaseOptions, ControlType, FxLayout, KeyValue} from './field-base';
import {Observable} from 'rxjs';

@Component({
  selector: 'dynamic-form-radio',
  template: `
    <div fxFlex [formGroup]="form">
      <label id="example-radio-group-label">{{field.label}}</label>
      <mat-radio-group
        aria-labelledby="example-radio-group-label"
        [fxLayout]="field.fxLayout"
        [required]="field.required"
        fxLayoutGap="30px"
        [formControlName]="field.key">
        <mat-radio-button *ngFor="let option of field.options | async"
                          [value]="option.key"
                          [ngStyle]="{width: field.stretch ? '100%' : null}">
          {{option.value}}
        </mat-radio-button>
      </mat-radio-group>
      <mat-progress-bar *ngIf="!(field.options | async)" mode="indeterminate" [color]="field.color"></mat-progress-bar>
    </div>
  `,
  styles: [`
    mat-radio-group { margin: 1.34375em 0 }
  `]
})
export class RadioComponent extends FieldBaseComponent<RadioField> { }

export class RadioField extends FieldBase<string> {
  public controlType = ControlType.Radio;
  public options: Observable<KeyValue[]>;
  public fxLayout: FxLayout;
  public stretch: boolean;
  constructor(options: RadioOptions) {
    super(options);
    this.options = options.options;
    this.fxLayout = options.fxLayout;
    this.stretch = !!options.stretch;
  }
}

export interface RadioOptions extends BaseOptions<string> {
  options: Observable<KeyValue[]>;
  fxLayout: FxLayout;
  stretch?: boolean;
}
