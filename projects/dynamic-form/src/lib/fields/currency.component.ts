import {
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  Optional,
  Self,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {Subject} from 'rxjs';
import {coerceBooleanProperty, coerceNumberProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {FieldBaseComponent, FieldBase, ControlType, BaseOptions} from './field-base';
import {formatCurrency} from '@angular/common';
import {isNaN} from 'lodash-es';

@Component({
  selector: 'dynamic-form-currency-input',
  template: `
    <div class="dynamic-form-currency-input-container"
         [attr.aria-labelledby]="_formField?.getLabelId()"
         (focusin)="onFocusIn($event)"
         (focusout)="onFocusOut($event)">
      <input matInput
             autocomplete="off"
             #currencyInput
             (focus)="onTouched()"
             [value]="inputValue"
             [required]="required"
             [disabled]="disabled"
             (change)="formatValue()"
             [placeholder]="placeholder">
    </div>
  `,
  styles: [`
    .dynamic-form-currency-input-container {
      display: flex;
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      display: none;
    }
    input {
      display: flex;
      -moz-appearance: textfield;
      text-align: right;
    }
    :host.floating {
      opacity: 1;
    }
  `],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  providers: [{ provide: MatFormFieldControl, useExisting: CurrencyInputComponent }],
})
export class CurrencyInputComponent implements OnChanges, ControlValueAccessor, MatFormFieldControl<string> {
  public static nextId = 0;

  @Input() public allowNegative!: boolean;

  @ViewChild('currencyInput', {static: true}) public currencyInput!: ElementRef;

  public inputValue = '';

  public stateChanges = new Subject<void>();
  public focused = false;
  public touched = false;
  public controlType = 'dynamic-form-currency-input';
  public id = `${this.controlType}-${CurrencyInputComponent.nextId++}`;

  public onChange = (_: any) => {};
  public onTouched = () => {};

  public get empty(): boolean {
    return !this.inputValue;
  }

  public get shouldLabelFloat() {
    return this.focused || !this.empty;
  }

  @Input('aria-describedby') public userAriaDescribedBy!: string;

  @Input() public get placeholder(): string {
    return this._placeholder;
  }
  public set placeholder(value: string) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  private _placeholder!: string;

  @Input() public get required(): boolean {
    return this._required;
  }
  public set required(value: boolean) {
    this._required = coerceBooleanProperty(value);
    this.stateChanges.next();
  }
  private _required = false;

  @Input() public get disabled(): boolean {
    return this._disabled;
  }
  public set disabled(value: boolean) {
    this._disabled = coerceBooleanProperty(value);
    this.currencyInput.nativeElement.disabled = this._disabled;
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input() public get value(): string | null {
    return this.inputValue || null;
  }
  public set value(val: string | null) {
    this.inputValue = val || '';
    this.stateChanges.next();
  }

  public get errorState(): boolean {
    return this.required && !this.inputValue && this.touched;
  }

  constructor(
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl,
  ) {
    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['allowNegative']?.currentValue !== true && this.currencyInput) {
      this.currencyInput.nativeElement.value = this.currencyInput.nativeElement.value.replace('-', '');
    }
  }

  public setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector(`.${this.controlType}-container`)!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  public onContainerClick() {
    this._focusMonitor.focusVia(this.currencyInput, 'program');
  }

  public onFocusIn(event: FocusEvent) {
    if (!this.focused) {
      this.focused = true;
      this.stateChanges.next();
    }
  }

  public onFocusOut(event: FocusEvent) {
    if (!this._elementRef.nativeElement.contains(event.relatedTarget as Element)) {
      this.touched = true;
      this.focused = false;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  public writeValue(value: any): void {
    if (!value && value !== 0) {
      return;
    }
    const val = Number(value);
    this.value = isNaN(val) ? '' : formatCurrency(val, 'en-US', '');
  }

  public registerOnChange(onChange: () => void): void {
    this.onChange = onChange;
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public formatValue(): void {
    const digitsOnly = this.currencyInput.nativeElement.value.replace(/[^0-9.-]+/g, '');
    this.currencyInput.nativeElement.value = digitsOnly ?
      formatCurrency(coerceNumberProperty(digitsOnly), 'en-US', '') : '';
    this.inputValue = this.currencyInput.nativeElement.value;
    this.onChange(this.inputValue);
  }
}

@Component({
  selector: 'dynamic-form-currency',
  template: `
    <mat-form-field fxFlex [appearance]="field.appearance" [color]="field.color" [formGroup]="form">
      <mat-label>{{field.label}}</mat-label>
      <dynamic-form-currency-input
        [formControlName]="field.key"
        [required]="field.required"
        [placeholder]="field.placeholder"
        [allowNegative]="field.allowNegative">
      </dynamic-form-currency-input>
      <mat-icon matPrefix>attach_money</mat-icon>
      <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
      <mat-error *ngIf="control?.hasError('required')">
        {{field.label}} is <strong>required</strong>
      </mat-error>
    </mat-form-field>
  `,
})
export class CurrencyComponent extends FieldBaseComponent<CurrencyField> { }

export class CurrencyField extends FieldBase<string> {
  public controlType = ControlType.Currency;
  public placeholder: string;
  public allowNegative: boolean;
  constructor(options: CurrencyOptions) {
    super(options);
    this.placeholder = options.placeholder || '0.00';
    this.allowNegative = options.allowNegative === undefined ? true : options.allowNegative;
  }
}

export interface CurrencyOptions extends BaseOptions<string> {
  placeholder?: string;
  allowNegative?: boolean;
}
