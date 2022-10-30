import {Component} from '@angular/core';
import {FieldBase, FieldBaseComponent, BaseOptions, ControlType, FieldPosition} from './field-base';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'dynamic-form-button',
  template: `
    <div fxFlex [fxLayoutAlign]="field.position + ' center'" [ngSwitch]="field.type">
      <button *ngSwitchCase="'icon'"
              mat-icon-button
              type="button"
              [matTooltip]="field.label"
              [color]="field.color"
              (click)="field.callback(form, field)">
        <mat-icon>{{field.icon}}</mat-icon>
      </button>
      <button *ngSwitchCase="'raised'"
              mat-raised-button
              type="button"
              [color]="field.color"
              (click)="field.callback(form, field)">
        <mat-icon *ngIf="field.icon">{{field.icon}}</mat-icon>
        {{field.label}}
      </button>
      <button *ngSwitchCase="'standard'"
              mat-button
              type="button"
              [color]="field.color"
              (click)="field.callback(form, field)">
        <mat-icon *ngIf="field.icon">{{field.icon}}</mat-icon>
        {{field.label}}
      </button>
      <div *ngSwitchDefault>Invalid Button Type</div>
    </div>
  `,
  styles: [`
    button {
      height: 56px;
      margin-bottom: 1.34375em;
    }
  `]
})
export class ButtonComponent extends FieldBaseComponent<ButtonField> { }

export class ButtonField extends FieldBase<void> {
  public controlType = ControlType.Button;
  public callback: ButtonCallback;
  public type: ButtonType;
  public icon: string;
  public position: FieldPosition;
  constructor(options: ButtonOptions) {
    super(options);
    this.callback = options.callback;
    this.type = options.type || 'standard';
    this.icon = options.icon || '';
    this.position = options.position || 'center';
  }
}

export interface ButtonOptions extends BaseOptions<void> {
  key: '';
  callback: ButtonCallback;
  type?: ButtonType;
  icon?: string;
  position?: FieldPosition;
}

export type ButtonType = 'icon' | 'raised' | 'standard';

export type ButtonCallback = (form: UntypedFormGroup, field: ButtonField) => void;
