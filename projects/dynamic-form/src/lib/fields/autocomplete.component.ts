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
import {Observable, Subject} from 'rxjs';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {FieldBaseComponent, FieldBase, ControlType, BaseOptions} from './field-base';

@Component({
  selector: 'dynamic-form-autocomplete-input',
  template: `
    <div class="dynamic-form-autocomplete-input-container"
         [attr.aria-labelledby]="_formField?.getLabelId()"
         (focusin)="onFocusIn($event)"
         (focusout)="onFocusOut($event)">
      <input matInput
             autocomplete="off"
             #inputEl
             [value]="inputValue"
             [required]="required"
             [disabled]="disabled"
             (input)="handleInput(inputEl.value)"
             [matAutocomplete]="auto"
             [placeholder]="placeholder">
      <mat-autocomplete autoActiveFirstOption
                        (optionSelected)="optionSelected($event)"
                        #auto="matAutocomplete"
                        [displayWith]="displayFn.bind(this)">
        <mat-option *ngFor="let item of filteredItems" [value]="item">
          {{item[displayField]}}
        </mat-option>
        <mat-option *ngIf="onAddItem" class="add-new" [value]="selectedItem" (click)="onAddItem()">
          ADD NEW
        </mat-option>
      </mat-autocomplete>
    </div>
  `,
  styles: [`
    .dynamic-form-autocomplete-input-container {
      display: flex;
    }
    input {
      display: flex;
      -moz-appearance: textfield;
    }
    :host.floating {
      opacity: 1;
    }
    .add-new {
      text-align: center;
      font-size: larger;
      font-weight: bold;
      border: 1px solid #ccc;
    }
  `],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  providers: [{ provide: MatFormFieldControl, useExisting: AutocompleteInputComponent }],
  exportAs: 'autocompleteInput',
})
export class AutocompleteInputComponent<T> implements OnChanges, ControlValueAccessor, MatFormFieldControl<string> {
  public static nextId = 0;

  @Input() public options!: T[] | null;
  @Input() public displayField!: keyof T;
  @Input() public itemKey!: keyof T;
  @Input() public onAddItem: (() => void) | undefined;

  @ViewChild('inputEl') public autocompleteInput!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) public autocompleteTrigger!: MatAutocompleteTrigger;

  private queuedValue!: string | null;

  public selectedItem: T | undefined;
  public inputValue = '';
  public filteredItems!: T[];

  public stateChanges = new Subject<void>();
  public focused = false;
  public touched = false;
  public controlType = 'dynamic-form-autocomplete-input';
  public id = `${this.controlType}-${AutocompleteInputComponent.nextId++}`;

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
    if (this.autocompleteInput) {
      this.autocompleteInput.nativeElement.disabled = this._disabled;
    }
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
    return this.required && this.empty && this.touched;
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
    const options = changes['options'];
    if (options) {
      if (options.previousValue === null && options.currentValue !== null && this.queuedValue) {
        this.writeValue(this.queuedValue);
      }
      this.handleInput(this.value || '');
    }
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    const item: T = event.option.value;
    this._onChange(item);
  }

  public displayFn(item?: T): string {
    return item ? String(item[this.displayField]) : '';
  }

  public setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector(`.${this.controlType}-container`)!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  public onContainerClick() {
    this._focusMonitor.focusVia(this.autocompleteInput, 'program');
    setTimeout(() => {
      if (!this.disabled) {
        this.autocompleteTrigger.openPanel();
      }
    });
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

  public writeValue(value: string | null): void {
    if (!this.options) {
      this.queuedValue = value;
    } else {
      const item: any = this.options.find((i: any) => i[this.itemKey] == value);
      this._onChange(item);
      this.filteredItems = value ? this.options.filter((item ) =>
        String(item[this.displayField]).toLowerCase().includes(value)) : this.options;
    }
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

  public handleInput(value: string): void {
    if (this.options) {
      this.filteredItems = this.options.filter((item ) =>
        String(item[this.displayField]).toLowerCase().includes(value));
    }
    this.value = value;
    if (this.selectedItem && !value) {
      this._onChange(undefined);
    }
  }

  private _onChange(item?: T): void {
    this.selectedItem = item;
    this.onChange(item ? String(item[this.itemKey]) : null);
    this.value = item ? String(item[this.displayField]) : null;
  }
}


@Component({
  selector: 'dynamic-form-autocomplete',
  template: `
    <mat-form-field fxFlex [appearance]="field.appearance" [color]="field.color" [formGroup]="form">
      <mat-label>{{field.label}}</mat-label>
      <dynamic-form-autocomplete-input
        #input="autocompleteInput"
        [formControlName]="field.key"
        [required]="field.required"
        [placeholder]="field.placeholder"
        [displayField]="field.displayField"
        [itemKey]="field.itemKey"
        [onAddItem]="field.onAddItem"
        [options]="field.options | async">
      </dynamic-form-autocomplete-input>
      <button mat-icon-button
              matSuffix
              type="button"
              [disabled]="input.disabled"
              *ngIf="input.inputValue"
              (click)="input.handleInput('')">
        <mat-icon>close</mat-icon>
      </button>
      <mat-progress-bar *ngIf="!input.options" mode="indeterminate" [color]="field.color"></mat-progress-bar>
      <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
      <mat-error *ngIf="control?.hasError('required')">
        {{field.label}} is <strong>required</strong>
      </mat-error>
    </mat-form-field>
  `,
})
export class AutocompleteComponent<T> extends FieldBaseComponent<AutocompleteField<T>> { }

export class AutocompleteField<T> extends FieldBase<string> {
  public controlType = ControlType.Autocomplete;
  public placeholder: string;
  public itemKey: keyof T;
  public displayField: keyof T;
  public options: Observable<T[]>;
  public onAddItem: (() => void) | undefined;
  constructor(options: AutocompleteOptions<T>) {
    super(options);
    this.placeholder = options.placeholder || '';
    this.displayField = options.displayField;
    this.itemKey = options.itemKey;
    this.options = options.options;
    this.onAddItem = options.onAddItem;
  }
}

export interface AutocompleteOptions<T> extends BaseOptions<string> {
  itemKey: keyof T;
  displayField: keyof T;
  options: Observable<T[]>;
  placeholder?: string;
  onAddItem?: () => void;
}
