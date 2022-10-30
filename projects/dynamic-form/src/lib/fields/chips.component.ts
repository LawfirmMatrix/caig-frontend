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
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent, MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {ControlValueAccessor, NgControl} from '@angular/forms';
import {ThemePalette} from '@angular/material/core';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {FocusMonitor} from '@angular/cdk/a11y';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {difference} from 'lodash-es';
import {FieldBaseComponent, BaseOptions, FieldBase, ControlType} from './field-base';

@Component({
  selector: 'dynamic-form-chips-input',
  template: `
    <div class="dynamic-form-chips-input-container"
         [attr.aria-labelledby]="_formField?.getLabelId()"
         (focusin)="onFocusIn($event)"
         (focusout)="onFocusOut($event)">
      <mat-chip-list #chipList="matChipList" [selectable]="selectable" [disabled]="disabled">
        <mat-chip
          *ngFor="let chip of chips; let i = index;"
          [removable]="removable"
          [color]="chipColor"
          (removed)="remove(i)"
          [value]="chip"
          [selected]="selectable && (!selected || selected(chip, i))">
          {{chip}}
          <mat-icon matChipRemove *ngIf="removable">cancel</mat-icon>
        </mat-chip>
        <input
          [placeholder]="placeholder"
          [value]="inputValue"
          #inputEl
          autocomplete="off"
          (input)="handleInput(inputEl.value)"
          [matAutocomplete]="auto"
          [matAutocompleteDisabled]="!options"
          [matChipInputFor]="chipList"
          [matChipInputSeparatorKeyCodes]="separatorKeysCodes"
          (matChipInputTokenEnd)="add($event)">
      </mat-chip-list>
      <mat-autocomplete #auto="matAutocomplete" autoActiveFirstOption (optionSelected)="optionSelected($event)">
        <mat-option *ngFor="let item of filteredItems" [value]="item">
          {{item}}
        </mat-option>
      </mat-autocomplete>
    </div>
  `,
  styles: [`
    .dynamic-form-chips-input-container {
      display: flex;
    }
    mat-chip-list {
      width: 100%;
    }
    input {
      display: flex;
      -moz-appearance: textfield;
    }
    :host.floating {
      opacity: 1;
    }
  `],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  providers: [{ provide: MatFormFieldControl, useExisting: ChipsInputComponent }],
  exportAs: 'chipsInput',
})
export class ChipsInputComponent implements OnChanges, ControlValueAccessor, MatFormFieldControl<string[]> {
  public static nextId = 0;

  @Input() public options!: string[] | null;
  @Input() public removable!: boolean;
  @Input() public selectable!: boolean;
  @Input() public selected: ((chip: string, index: number) => boolean) | undefined;
  @Input() public separatorKeysCodes!: number[];
  @Input() public chipColor: ThemePalette;

  @ViewChild('inputEl') public chipsInputEl!: ElementRef;
  @ViewChild(MatAutocompleteTrigger) public autocompleteTrigger!: MatAutocompleteTrigger;

  public inputValue = '';
  public chips: string[] = [];
  public filteredItems: string[] = [];

  public stateChanges = new Subject<void>();
  public focused = false;
  public touched = false;
  public controlType = 'dynamic-form-chips-input';
  public id = `${this.controlType}-${ChipsInputComponent.nextId++}`;

  public onChange = (_: any) => {};
  public onTouched = () => {};

  public get empty(): boolean {
    return !this.inputValue && !this.chips.length;
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
    this.chipsInputEl.nativeElement.disabled = this._disabled;
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input() public get value(): string[] | null {
    return this.chips.length ? this.chips : null;
  }
  public set value(val: string[] | null) {
    this.chips = val || [];
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
    if (changes['options']) {
      this.handleInput(this.inputValue || '');
    }
  }

  public setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector(`.${this.controlType}-container`)!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  public onContainerClick() {
    this._focusMonitor.focusVia(this.chipsInputEl, 'program');
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

  public handleInput(value: string): void {
    if (this.options) {
      const options = difference(this.options, this.chips);
      this.filteredItems = options.filter((item ) => item.toLowerCase().includes(value));
    }
    this.inputValue = value;
  }

  public remove(index: number): void {
    const chip = this.chips.splice(index, 1);
    if (this.options) {
      this.filteredItems.unshift(...chip);
    }
    this.onChange(this.chips);
    this.onTouched();
  }

  public add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const isNotAutocomplete = !this.options;
      const isAutocompleteOption = this.filteredItems.includes(value);
      const isNotAdded = !this.chips.includes(value);
      if (isNotAutocomplete || (isAutocompleteOption && isNotAdded)) {
        this._pushChip(value);
      }
    }
  }

  public optionSelected(event: MatAutocompleteSelectedEvent): void {
    this._pushChip(event.option.viewValue);
  }

  public writeValue(values?: string[]): void {
    this.chips = values || [];
  }

  public registerOnChange(onChange: (value: any) => void): void {
    this.onChange = (chips: string[]) => onChange(chips.length ? chips : undefined);
  }

  public registerOnTouched(onTouched: () => void): void {
    this.onTouched = onTouched;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  private _pushChip(value: string): void {
    this.chips.push(value);
    const index = this.filteredItems.indexOf(value);
    if (index > -1) {
      this.filteredItems.splice(index, 1);
    }
    this.onChange(this.chips);
    this.chipsInputEl.nativeElement.value = '';
    this.handleInput('');
  }
}

@Component({
  selector: 'dynamic-form-chips',
  template: `
    <mat-form-field fxFlex [appearance]="field.appearance" [color]="field.color" [formGroup]="form">
      <mat-label>{{field.label}}</mat-label>
      <dynamic-form-chips-input
        #input="chipsInput"
        [formControlName]="field.key"
        [removable]="field.removable"
        [selectable]="field.selectable"
        [selected]="field.selected"
        [separatorKeysCodes]="field.separatorKeysCodes"
        [chipColor]="field.chipColor"
        [required]="field.required"
        [placeholder]="field.placeholder"
        [options]="field.options | async">
      </dynamic-form-chips-input>
      <mat-progress-bar *ngIf="field.options !== undefined && !input.options" mode="indeterminate" [color]="field.color"></mat-progress-bar>
      <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
      <mat-error *ngIf="control?.hasError('required')">
        {{field.label}} is <strong>required</strong>
      </mat-error>
    </mat-form-field>
  `,
})
export class ChipsComponent extends FieldBaseComponent<ChipsField> { }

export class ChipsField extends FieldBase<string[]> {
  public controlType = ControlType.Chips;
  public options: Observable<string[]>|undefined;
  public removable: boolean;
  public selectable: boolean;
  public selected: ((chip: string, index: number) => boolean) | undefined;
  public placeholder: string;
  public separatorKeysCodes: number[];
  public chipColor: ThemePalette;
  constructor(options: ChipsOptions) {
    super(options);
    this.options = options.options;
    this.removable = options.removable === undefined ? true : options.removable;
    this.selectable = options.selectable === undefined ? true : options.selectable;
    this.selected = options.selected;
    this.placeholder = options.placeholder || '';
    this.separatorKeysCodes = options.separatorKeysCodes || [ENTER, COMMA];
    this.chipColor = options.chipColor || 'primary';
  }
}

export interface ChipsOptions extends BaseOptions<string[]> {
  options?: Observable<string[]>;
  removable?: boolean;
  selectable?: boolean;
  selected?: (chip: string, index: number) => boolean;
  placeholder?: string;
  separatorKeysCodes?: number[];
  chipColor?: ThemePalette;
}
