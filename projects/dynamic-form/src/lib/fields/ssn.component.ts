import {
  Component, DoCheck,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Optional,
  Self,
  ViewChild
} from '@angular/core';
import {MAT_FORM_FIELD, MatFormField, MatFormFieldControl} from '@angular/material/form-field';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NgControl,
  Validators,
  FormControl
} from '@angular/forms';
import {Subject, distinctUntilChanged, map, debounceTime} from 'rxjs';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {FieldBaseComponent, FieldBase, ControlType, FieldPosition, BaseOptions} from './field-base';

@Component({
  selector: 'dynamic-form-ssn-input',
  template: `
    <div role="group"
         class="dynamic-form-ssn-input-container"
         [formGroup]="parts"
         [attr.aria-labelledby]="_formField?.getLabelId()"
         (focusin)="onFocusIn($event)"
         (focusout)="onFocusOut($event)">
      <input class="dynamic-form-ssn-input-element"
             formControlName="segment1"
             size="3"
             maxlength="3"
             aria-label="Segment 1"
             (keyup)="_handleInput($event, parts.controls.segment1, seg2)"
             #seg1>
      <span class="dynamic-form-ssn-input-spacer">&ndash;</span>
      <input class="dynamic-form-ssn-input-element"
             formControlName="segment2"
             maxlength="2"
             size="2"
             aria-label="Segment 2"
             (keyup)="_handleInput($event, parts.controls.segment2, seg3)"
             (keyup.backspace)="autoFocusPrev(seg2, seg1)"
             #seg2>
      <span class="dynamic-form-ssn-input-spacer">&ndash;</span>
      <input class="dynamic-form-ssn-input-element"
             formControlName="segment3"
             maxlength="4"
             size="4"
             aria-label="Segment 3"
             (keyup)="_handleInput($event, parts.controls.segment3)"
             (keyup.backspace)="autoFocusPrev(seg3, seg2)"
             #seg3>
    </div>
  `,
  styles: [`
    .dynamic-form-ssn-input-container {
      display: flex;
    }
    .dynamic-form-ssn-input-element {
      border: none;
      background: none;
      color: inherit;
      padding: 0;
      outline: none;
      font: inherit;
      text-align: center;
    }
    .dynamic-form-ssn-input-spacer {
      opacity: 0;
      transition: opacity 200ms;
    }
    :host.floating .dynamic-form-ssn-input-spacer {
      opacity: 1;
    }
  `],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  providers: [{ provide: MatFormFieldControl, useExisting: SsnInputComponent }],
})
export class SsnInputComponent implements ControlValueAccessor, MatFormFieldControl<string>, OnDestroy, DoCheck {
  public static nextId = 0;

  @ViewChild('seg1') public segment1Input!: HTMLInputElement;
  @ViewChild('seg2') public segment2Input!: HTMLInputElement;
  @ViewChild('seg3') public segment3Input!: HTMLInputElement;

  public parts: FormGroup<{
    segment1: FormControl<string | null>,
    segment2: FormControl<string | null>,
    segment3: FormControl<string | null>,
  }>;

  public stateChanges = new Subject<void>();
  public focused = false;
  public touched = false;
  public controlType = 'dynamic-form-ssn-input';
  public id = `${this.controlType}-${SsnInputComponent.nextId++}`;

  public onChange = (_: any) => {};
  public onTouched = () => {};

  public get empty() {
    const {
      value: { segment1, segment2, segment3 }
    } = this.parts;

    return !segment1 && !segment2 && !segment3;
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
    this._disabled ? this.parts.disable() : this.parts.enable();
    this.stateChanges.next();
  }
  private _disabled = false;

  @Input() public get value(): string | null {
    if (this.parts.valid) {
      const {
        value: { segment1, segment2, segment3 }
      } = this.parts;
      return `${segment1}-${segment2}-${segment3}`;
    }
    return null;
  }
  public set value(tel: string | null) {
    const digits = tel ? tel.replace(/\D/g, '') : '';
    const validNumber = digits.length === 9;
    const segment1 = validNumber ? digits.slice(0, 3) : '';
    const segment2 = validNumber ? digits.slice(3, 5) : '';
    const segment3 = validNumber ? digits.slice(5, 9) : '';
    this.parts.setValue({segment1, segment2, segment3});
    this.stateChanges.next();
  }

  public get errorState(): boolean {
    return this.required && this.parts.invalid && this.touched;
  }

  constructor(
    public formBuilder: FormBuilder,
    private _focusMonitor: FocusMonitor,
    private _elementRef: ElementRef<HTMLElement>,
    @Optional() @Inject(MAT_FORM_FIELD) public _formField: MatFormField,
    @Optional() @Self() public ngControl: NgControl) {
    this.parts = formBuilder.group({
      segment1: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)]
      ],
      segment2: [
        '',
        [Validators.required, Validators.minLength(2), Validators.maxLength(2)]
      ],
      segment3: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
      ],
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    this.parts.statusChanges
      .pipe(
        debounceTime(100),
        map(() => this.value),
        distinctUntilChanged(),
      )
      .subscribe((value) => this.onChange(value));
  }

  public ngDoCheck() {
    if (!this.touched && this.ngControl.touched) {
      this.touched = true;
      this.onTouched();
      this.stateChanges.next();
    }
  }

  public ngOnDestroy() {
    this.stateChanges.complete();
    this._focusMonitor.stopMonitoring(this._elementRef);
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

  public autoFocusNext(control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (!control.errors && nextElement) {
      this.selectInput(nextElement);
    }
  }

  public autoFocusPrev(currElement: HTMLInputElement, prevElement: HTMLInputElement): void {
    if (!currElement.selectionStart) {
      this.selectInput(prevElement);
    }
  }

  private selectInput(el: HTMLInputElement): void {
    this._focusMonitor.focusVia(el, 'program');
    el.setSelectionRange(el.value.length, el.value.length + 1);
  }

  public setDescribedByIds(ids: string[]) {
    const controlElement = this._elementRef.nativeElement
      .querySelector(`.${this.controlType}-container`)!;
    controlElement.setAttribute('aria-describedby', ids.join(' '));
  }

  public onContainerClick() {
    if (this.empty) {
      this._focusMonitor.focusVia(this.segment1Input, 'program');
    }
  }

  public writeValue(tel: string | null): void {
    this.value = tel;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public _handleInput(event: KeyboardEvent, control: AbstractControl, nextElement?: HTMLInputElement): void {
    if (event.key !== 'Backspace') {
      this.autoFocusNext(control, nextElement);
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
}

@Component({
  selector: 'dynamic-form-ssn',
  template: `
    <div *ngIf="control as ctrl" fxFlex [fxLayoutAlign]="field.position + ' center'" [formGroup]="form">
      <mat-form-field [style.width.px]="165" [appearance]="field.appearance" [color]="field.color">
        <mat-label>{{field.label}}</mat-label>
        <dynamic-form-ssn-input [formControlName]="field.key" [required]="field.required"></dynamic-form-ssn-input>
        <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
        <mat-error *ngIf="ctrl.hasError('required')">
          {{field.label}} is <strong>required</strong>
        </mat-error>
      </mat-form-field>
    </div>
  `,
})
export class SsnComponent extends FieldBaseComponent<SsnField> { }

export class SsnField extends FieldBase<string> {
  public controlType = ControlType.Ssn;
  public position: FieldPosition;
  constructor(options: SsnOptions) {
    super(options);
    this.position = options.position || 'center';
    this.fxFlex = options.fxFlex === undefined ? 0 : options.fxFlex;
  }
}

export interface SsnOptions extends BaseOptions<string> {
  position?: FieldPosition;
}
