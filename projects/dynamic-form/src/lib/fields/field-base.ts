import {ThemePalette} from '@angular/material/core';
import {MatFormFieldAppearance} from '@angular/material/form-field';
import {FormGroup, ValidatorFn} from '@angular/forms';

export abstract class FieldBaseComponent<T extends FieldBase<any>> {
  public field!: T;
  public form!: FormGroup;
  public get control() { return this.form.controls[this.field.key] };
}

export abstract class FieldBase<T> {
  public value: T|undefined;
  public key: string;
  public label: string;
  public required: boolean;
  public fxFlex: number;
  public color: ThemePalette;
  public hint: FormFieldHint|undefined;
  public appearance: MatFormFieldAppearance;
  public disabled: boolean;
  public onChange: ((value: any, form: FormGroup) => void)|undefined;
  public validators: ValidatorFn[]|undefined;
  public focus: boolean;

  public abstract controlType: ControlType;
  constructor(options: BaseOptions<T>) {
    this.value = options.value;
    this.key = options.key || '';
    this.label = options.label || '';
    this.required = !!options.required;
    this.fxFlex = options.fxFlex === undefined ? 100 : options.fxFlex;
    this.color = options.color || 'accent';
    this.appearance = options.appearance || 'outline';
    this.hint = options.hint;
    this.disabled = !!options.disabled;
    this.onChange = options.onChange;
    this.validators = options.validators;
    this.focus = !!options.focus;
  }
}

export interface BaseOptions<T> {
  label: string;
  key: string;
  value?: T;
  required?: boolean;
  hide?: boolean;
  fxFlex?: number;
  color?: ThemePalette;
  appearance?: MatFormFieldAppearance;
  hint?: FormFieldHint;
  disabled?: boolean;
  onChange?: (value: any, form: FormGroup) => void;
  validators?: ValidatorFn[];
  focus?: boolean;
}

export enum ControlType {
  Input,
  Select,
  Textarea,
  Button,
  Checkbox,
  Radio,
  Autocomplete,
  Chips,
  Currency,
  PhoneNumber,
  Date,
  DateRange
}

export class FormFieldHint {
  constructor(public message: string, public align: 'start' | 'end' = 'start') { }
}

export type FieldPosition = 'start' | 'center' | 'end';

export type FxLayout = 'column' | 'row';

export type LabelPosition = 'before' | 'after';

export interface KeyValue {
  key: any;
  value: string;
}

export interface FieldMenu {
  icon: string;
  items: FieldMenuItem[]
  disabled?: (value: string) => boolean;
}

export interface FieldMenuItem {
  name: string;
  callback: () => void;
  icon?: string;
  iconColor?: ThemePalette;
}
