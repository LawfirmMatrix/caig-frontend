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
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {FieldBaseComponent, FieldBase, ControlType, BaseOptions} from './field-base';
import {formatCurrency} from '@angular/common';

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
             (keyup)="handleInput($event)"
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
    const val = String(value);
    this.value = val ? formatAmount(parseValue(val)) : '';
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

  public handleInput(event?: KeyboardEvent): void {
    // @FIXME -- many problems with this approach. find new one.

    let currCaretPos = this.currencyInput.nativeElement.selectionStart || 0;
    let prevValue = this.currencyInput.nativeElement.value;

    // @FIXME -- delete when caret is at decimal point will increase input value, should just move caret over decimal point with no value change instead
    // if (event.key === 'Delete' && currCaretPos === 0 && prevValue) {
    //   prevValue = prevValue.substring(1);
    // }

    if (!this.allowNegative) {
      prevValue = prevValue.replace('-', '');
      currCaretPos = 0;
    }

    const numValue = parseValue(prevValue);

    this.currencyInput.nativeElement.value = this.allowNegative && prevValue === '-' ? prevValue : formatAmount(numValue);

    this.onChange(numValue || null);

    setCaretPosition(this.currencyInput.nativeElement, calculateNewCaretPos(prevValue, this.currencyInput.nativeElement.value, currCaretPos));
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
      <mat-error *ngIf="control.hasError('required')">
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

function parseValue(value: string): string {
  const valueArr = value.split('.');
  value = valueArr[0];
  if (valueArr[1]) {
    value += '.' + valueArr[1].substring(0, 2);
  }
  const num = parseFloat(value.replace(/,/g, ''));
  return !isNaN(num) ? num.toFixed(2) : '';
}

function formatAmount(value: string): string {
  if (!value) {
    return '';
  }
  const negative = value.startsWith('-');
  return value.replace(/./g, (c, i, a) =>
    (negative ? (i < 2 ? 0 : i) : i) && c !== '.' && ((a.length - i) % 3 === 0) ? ',' + c : c
  );
}

function calculateNewCaretPos(prevValue: string, currValue: string, currPos: number): number {
  return currPos + getNotDecimalsCount(currValue) - getNotDecimalsCount(prevValue);

  function getNotDecimalsCount(str: string): number {
    let count = 0;
    for (let i = 0; i < currPos; i++) {
      if (!/^\d+$/.test(str[i])) {
        count++;
      }
    }
    return count;
  }
}


function setCaretPosition(ctrl: HTMLInputElement, pos: number | null): void {
  ctrl.setSelectionRange(pos, pos);
}
