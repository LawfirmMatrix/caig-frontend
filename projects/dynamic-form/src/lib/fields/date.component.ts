import {Component, OnInit} from '@angular/core';
import {Moment} from 'moment';
import {DateFilterFn, MatCalendarView, MatDatepicker} from '@angular/material/datepicker';
import {noop, filter} from 'rxjs';
import {FieldBaseComponent, FieldBase, ControlType, BaseOptions} from './field-base';

@Component({
  selector: 'dynamic-form-datepicker',
  template: `
    <mat-form-field [formGroup]="form" [appearance]="field.appearance" [color]="field.color">
      <mat-label>{{field.label}}</mat-label>
      <input autocomplete="off"
             matInput
             [min]="field.min"
             [max]="field.max"
             [required]="field.required"
             [matDatepicker]="dp"
             [matDatepickerFilter]="field.dateFilter"
             [placeholder]="field.placeholder"
             [formControlName]="field.key">
      <mat-datepicker-toggle matSuffix [for]="dp"></mat-datepicker-toggle>
      <mat-datepicker #dp [startView]="field.startView" (monthSelected)="field.monthSelected($event, dp)"></mat-datepicker>
      <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
      <mat-error *ngIf="control?.hasError('required')">
        {{field.label}} is <strong>required</strong>
      </mat-error>
    </mat-form-field>
  `,
})
export class DateComponent extends FieldBaseComponent<DateField> implements OnInit {
  // @FIXME - use custom date adapter to handle ISO date string format as form control value
  public ngOnInit() {
    const ctrl = this.control;
    if (ctrl) {
      ctrl.valueChanges
        .pipe(filter((value) => !!(value && value.format)))
        .subscribe((value) => ctrl.setValue(value.format('YYYY-MM-DD'), {emitEvent: false}));
    }
  }
}

export class DateField extends FieldBase<Moment> {
  public controlType = ControlType.Date;
  public placeholder: string;
  public startView: MatCalendarView;
  public monthSelected: Function;
  public min: Moment | undefined;
  public max: Moment | undefined;
  public dateFilter: DateFilterFn<Moment | null | undefined>;
  constructor(options: DateOptions) {
    super(options);
    this.placeholder = options.placeholder || '';
    this.fxFlex = options.fxFlex === undefined ? 0 : options.fxFlex;
    this.startView = options.startView || 'month';
    this.monthSelected = options.monthSelected || noop;
    this.min = options.min;
    this.max = options.max;
    this.dateFilter = options.dateFilter || ( () => true );
  }
}

export interface DateOptions extends BaseOptions<Moment> {
  placeholder?: string;
  startView?: MatCalendarView;
  monthSelected?: (event: any, datepicker: MatDatepicker<any>) => void;
  min?: Moment;
  max?: Moment;
  dateFilter?: DateFilterFn<Moment | null | undefined>;
}
