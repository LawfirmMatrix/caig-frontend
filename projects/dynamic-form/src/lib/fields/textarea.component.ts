import {Component} from '@angular/core';
import {FieldBase, FieldBaseComponent, BaseOptions, ControlType} from './field-base';

@Component({
  selector: 'dynamic-form-textarea',
  template: `
    <mat-form-field *ngIf="control as ctrl" fxFlex [formGroup]="form" [appearance]="field.appearance" [color]="field.color">
      <mat-label>{{field.label}}</mat-label>
      <textarea
        #input="matInput"
        matInput
        [required]="field.required"
        autocomplete="off"
        [formControlName]="field.key"
        [placeholder]="field.placeholder"
      ></textarea>
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
    </mat-form-field>
  `,
})
export class TextareaComponent extends FieldBaseComponent<TextareaField> { }

export class TextareaField extends FieldBase<string> {
  public controlType = ControlType.Textarea;
  public placeholder: string;
  constructor(options: TextareaOptions) {
    super(options);
    this.placeholder = options.placeholder || '';
  }
}

export interface TextareaOptions extends BaseOptions<string> {
  placeholder?: string;
}
