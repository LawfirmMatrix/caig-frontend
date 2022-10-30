import {
  Component, DoCheck,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Optional,
  Self,
  SimpleChanges,
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
import {Subject, distinctUntilChanged, skip, merge, map, debounceTime} from 'rxjs';
import {BooleanInput, coerceBooleanProperty} from '@angular/cdk/coercion';
import {FocusMonitor} from '@angular/cdk/a11y';
import {FieldBaseComponent, FieldBase, ControlType, FieldPosition, FieldMenu, BaseOptions} from './field-base';

@Component({
  selector: 'dynamic-form-phone-number-input',
  template: `
    <div role="group"
         class="dynamic-form-phone-number-input-container"
         [formGroup]="parts"
         [attr.aria-labelledby]="_formField?.getLabelId()"
         (focusin)="onFocusIn($event)"
         (focusout)="onFocusOut($event)">
      <input class="dynamic-form-phone-number-input-element"
             formControlName="area"
             size="3"
             maxlength="3"
             aria-label="Area code"
             (keyup)="_handleInput($event, parts.controls.area, exchange)"
             #area>
      <span class="dynamic-form-phone-number-input-spacer">&ndash;</span>
      <input class="dynamic-form-phone-number-input-element"
             formControlName="exchange"
             maxlength="3"
             size="3"
             aria-label="Exchange code"
             (keyup)="_handleInput($event, parts.controls.exchange, subscriber)"
             (keyup.backspace)="autoFocusPrev(exchange, area)"
             #exchange>
      <span class="dynamic-form-phone-number-input-spacer">&ndash;</span>
      <input class="dynamic-form-phone-number-input-element"
             formControlName="subscriber"
             maxlength="4"
             size="4"
             aria-label="Subscriber number"
             (keyup)="_handleInput($event, parts.controls.subscriber, extension ? ext : undefined)"
             (keyup.backspace)="autoFocusPrev(subscriber, exchange)"
             #subscriber>
      <span *ngIf="extension" class="dynamic-form-phone-number-input-spacer">Ext.</span>
      <input class="dynamic-form-phone-number-input-element"
             [style.display]="extension ? 'initial' : 'none'"
             formControlName="ext"
             maxlength="5"
             size="5"
             aria-label="Extension number"
             (keyup)="_handleInput($event, parts.controls.subscriber)"
             (keyup.backspace)="autoFocusPrev(ext, subscriber)"
             #ext>
    </div>
  `,
  styles: [`
    .dynamic-form-phone-number-input-container {
      display: flex;
    }
    .dynamic-form-phone-number-input-element {
      border: none;
      background: none;
      color: inherit;
      padding: 0;
      outline: none;
      font: inherit;
      text-align: center;
    }
    .dynamic-form-phone-number-input-spacer {
      opacity: 0;
      transition: opacity 200ms;
    }
    :host.floating .dynamic-form-phone-number-input-spacer {
      opacity: 1;
    }
  `],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
  },
  providers: [{ provide: MatFormFieldControl, useExisting: PhoneNumberInputComponent }],
})
export class PhoneNumberInputComponent implements ControlValueAccessor, MatFormFieldControl<string>, OnChanges, OnDestroy, DoCheck {
  public static nextId = 0;

  @Input() public extension!: boolean;

  @ViewChild('area') public areaInput!: HTMLInputElement;
  @ViewChild('exchange') public exchangeInput!: HTMLInputElement;
  @ViewChild('subscriber') public subscriberInput!: HTMLInputElement;

  public parts: FormGroup<{
    area: FormControl<any>,
    exchange: FormControl<any>,
    subscriber: FormControl<any>,
    ext: FormControl<any>,
  }>;

  public stateChanges = new Subject<void>();
  public focused = false;
  public touched = false;
  public controlType = 'dynamic-form-phone-number-input';
  public id = `${this.controlType}-${PhoneNumberInputComponent.nextId++}`;

  public onChange = (_: any) => {};
  public onTouched = () => {};

  public get empty() {
    const {
      value: { area, exchange, subscriber, ext }
    } = this.parts;

    return !area && !exchange && !subscriber && !ext;
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
        value: { area, exchange, subscriber, ext }
      } = this.parts;
      return new PhoneNumber(area, exchange, subscriber, ext).toString();
    }
    return null;
  }
  public set value(tel: string | null) {
    const digits = tel ? tel.replace(/\D/g, '') : '';
    const validNumber = digits.length > 9;
    const area = validNumber ? digits.slice(0, 3) : '';
    const exchange = validNumber ? digits.slice(3, 6) : '';
    const subscriber = validNumber ? digits.slice(6, 10) : '';
    const ext = digits.length > 10 ? digits.slice(10, 15) : '';
    this.parts.setValue(new PhoneNumber(area, exchange, subscriber, ext));
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
      area: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)]
      ],
      exchange: [
        null,
        [Validators.required, Validators.minLength(3), Validators.maxLength(3)]
      ],
      subscriber: [
        null,
        [Validators.required, Validators.minLength(4), Validators.maxLength(4)]
      ],
      ext: [
        null,
        [Validators.maxLength(5)],
      ]
    });

    if (this.ngControl != null) {
      this.ngControl.valueAccessor = this;
    }

    const statusChanges$ = this.parts.statusChanges.pipe(distinctUntilChanged());
    const valueChanges$ = this.parts.controls.ext.valueChanges;

    merge(statusChanges$, valueChanges$)
      .pipe(
        debounceTime(100),
        map(() => this.value),
        distinctUntilChanged(),
        skip(1),
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

  public ngOnChanges(changes: SimpleChanges) {
    const ext = changes['extension'];
    if (ext) {
      const func = ext.currentValue ? 'enable' : 'disable';
      this.parts.controls['ext'][func]()
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
      // this.onChange(this.value)
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
      this._focusMonitor.focusVia(this.areaInput, 'program');
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
      // this.onChange(this.value);
    }
  }

  static ngAcceptInputType_disabled: BooleanInput;
  static ngAcceptInputType_required: BooleanInput;
}

@Component({
  selector: 'dynamic-form-phone-number',
  template: `
    <div *ngIf="control as ctrl" fxFlex [fxLayoutAlign]="field.position + ' center'" [formGroup]="form">
      <mat-form-field [ngStyle]="{width: (field.extension ? 265 : 195) - (field.showIcon ? 0 : 30) + 'px'}" [appearance]="field.appearance" [color]="field.color">
        <mat-label>{{field.label}}</mat-label>
        <dynamic-form-phone-number-input [extension]="field.extension"
                                [formControlName]="field.key"
                                [required]="field.required"></dynamic-form-phone-number-input>
        <mat-icon *ngIf="field.showIcon" matSuffix>phone</mat-icon>
        <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
        <mat-error *ngIf="ctrl.hasError('required')">
          {{field.label}} is <strong>required</strong>
        </mat-error>
      </mat-form-field>
      <button *ngIf="field.menu" mat-icon-button style="margin-bottom: 16px" [matMenuTriggerFor]="phoneMenu" [disabled]="field.menu.disabled && field.menu.disabled(ctrl.value)">
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
})
export class PhoneNumberComponent extends FieldBaseComponent<PhoneNumberField> { }

export class PhoneNumberField extends FieldBase<PhoneNumber> {
  public controlType = ControlType.PhoneNumber;
  public position: FieldPosition;
  public extension: boolean;
  public menu: FieldMenu | undefined;
  public showIcon: boolean;
  constructor(options: PhoneNumberOptions) {
    super(options);
    this.hint = options.hint || { message: 'Include area code', align: 'start' };
    this.position = options.position || 'center';
    this.fxFlex = options.fxFlex === undefined ? 0 : options.fxFlex;
    this.extension = !!options.extension;
    this.menu = options.menu;
    this.showIcon = options.showIcon !== false;
  }
}

export interface PhoneNumberOptions extends BaseOptions<PhoneNumber> {
  position?: FieldPosition;
  extension?: boolean;
  menu?: FieldMenu;
  showIcon?: boolean;
}

export class PhoneNumber {
  constructor(
    public area: string,
    public exchange: string,
    public subscriber: string,
    public ext: string = '',
  ) { }
  public toString(): string {
    return `${this.area}-${this.exchange}-${this.subscriber}${this.ext ? ` x ${this.ext}` : ''}`;
  }
}
