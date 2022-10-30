import {Component} from '@angular/core';
import {FieldBaseComponent, FieldBase, ControlType, FieldMenu, BaseOptions} from './field-base';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'dynamic-form-input',
  template: `
    <div fxFlex *ngIf="control as ctrl">
      <mat-form-field fxFlex [formGroup]="form" [appearance]="field.appearance" [color]="field.color" [hideRequiredMarker]="false">
        <mat-label>{{field.label}}</mat-label>
        <input #input="matInput"
               [required]="field.required"
               matInput
               autocomplete="off"
               [formControlName]="field.key"
               [placeholder]="field.placeholder"
               [type]="field.type">
        <button *ngIf="field.clearButton && input.value" matSuffix mat-icon-button aria-label="Clear" (click)="ctrl.patchValue('')">
          <mat-icon>close</mat-icon>
        </button>
        <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
        <mat-error *ngIf="ctrl.getError('required')">
          {{field.label}} is <strong>required</strong>
        </mat-error>
        <mat-error *ngIf="ctrl.getError('maxlength') as err">
          {{field.label}} must be at most <strong>{{err.requiredLength}}</strong> characters
        </mat-error>
        <mat-error *ngIf="ctrl.getError('minlength') as err">
          {{field.label}} must be at least <strong>{{err.requiredLength}}</strong> characters
        </mat-error>
        <mat-error *ngIf="ctrl.getError('email') as err">
          {{field.label}} must be must be a <strong>valid</strong> email address
        </mat-error>
      </mat-form-field>
      <button *ngFor="let button of field.buttons"
              [matTooltip]="button.tooltip || ''"
              type="button"
              mat-icon-button
              [color]="button.color"
              (click)="button.callback(ctrl.value)"
              [disabled]="button.disabled && button.disabled(ctrl.value)">
        <mat-icon>{{button.icon}}</mat-icon>
      </button>
      <button *ngIf="field.menu" mat-icon-button type="button" [matMenuTriggerFor]="phoneMenu" [disabled]="field.menu.disabled && field.menu.disabled(ctrl.value)">
        <mat-icon>{{field.menu.icon}}</mat-icon>
      </button>
      <mat-menu #phoneMenu="matMenu">
        <button mat-menu-item *ngFor="let item of field.menu?.items" (click)="item.callback()">
          <mat-icon *ngIf="item.icon" [color]="item.iconColor">{{item.icon}}</mat-icon>
          {{item.name}}
        </button>
      </mat-menu>
    </div>
  `,
  styles: ['.mat-icon-button { margin-top: 10px }'],
})
export class InputComponent extends FieldBaseComponent<InputField> { }

export class InputField extends FieldBase<string> {
  public controlType = ControlType.Input;
  public type: string;
  public placeholder: string;
  public clearButton: boolean;
  public buttons: InputButton[] | undefined;
  public menu: FieldMenu | undefined;
  constructor(options: InputOptions) {
    super(options);
    this.type = options.type || 'text';
    this.placeholder = options.placeholder || '';
    this.clearButton = !!options.clearButton;
    this.buttons = options.buttons;
    this.menu = options.menu;
  }
}

export interface InputOptions extends BaseOptions<string> {
  type?: string;
  placeholder?: string;
  clearButton?: boolean;
  buttons?: InputButton[];
  menu?: FieldMenu;
}

export interface InputButton {
  icon: string;
  tooltip?: string;
  callback: (value: string) => void;
  color?: ThemePalette;
  disabled?: (value: string) => boolean;
}
