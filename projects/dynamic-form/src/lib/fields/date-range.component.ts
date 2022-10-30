import {Component, OnInit} from '@angular/core';
import {isMoment, Moment} from 'moment';
import {FormControl, FormGroup} from '@angular/forms';
import {distinctUntilChanged} from 'rxjs';
import {isEqual} from 'lodash-es';
import {FieldBaseComponent, FieldBase, ControlType, BaseOptions} from './field-base';

@Component({
  selector: 'lib-datepicker',
  template: `
    <mat-form-field fxFlex [appearance]="field.appearance" [color]="field.color">
      <mat-label>{{field.label}}</mat-label>
      <mat-date-range-input [formGroup]="range" [rangePicker]="picker" [required]="field.required || field.startRequired || field.endRequired">
        <input matStartDate formControlName="start" [required]="field.startRequired" [placeholder]="field.startPlaceholder">
        <input matEndDate formControlName="end" [required]="field.endRequired" [placeholder]="field.endPlaceholder">
      </mat-date-range-input>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-date-range-picker #picker></mat-date-range-picker>
      <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
      <mat-error *ngIf="range.controls.start.hasError('required')">{{field.startPlaceholder}} is <strong>required</strong></mat-error>
      <mat-error *ngIf="range.controls.end.hasError('required')">{{field.endPlaceholder}} is <strong>required</strong></mat-error>
      <mat-error *ngIf="range.controls.start.hasError('matStartDateInvalid')">Invalid {{field.startPlaceholder}}</mat-error>
      <mat-error *ngIf="range.controls.end.hasError('matEndDateInvalid')">Invalid {{field.endPlaceholder}}</mat-error>
    </mat-form-field>
  `,
})
export class DateRangeComponent extends FieldBaseComponent<DateRangeField> implements OnInit {
  public range = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // @FIXME - see DateComponent
  public ngOnInit() {
    const ctrl = this.control;
    if (ctrl) {
      const format = 'YYYY-MM-DD';
      this.range.valueChanges.subscribe((value) => {
        const dates = {
          start: isMoment(value.start) ? value.start.format(format) : value.start,
          end: isMoment(value.end) ? value.end.format(format) : value.end,
        };
        ctrl.setValue(dates);
      });
      ctrl.valueChanges
        .pipe(distinctUntilChanged(isEqual))
        .subscribe((value) => this.range.setValue(value));
    }
  }
}

export class DateRangeField extends FieldBase<Moment> {
  public controlType = ControlType.DateRange;
  public startPlaceholder: string;
  public endPlaceholder: string;
  public startRequired: boolean;
  public endRequired: boolean;
  constructor(options: DateRangeOptions) {
    super(options);
    this.startPlaceholder = options.startPlaceholder || 'Start date';
    this.endPlaceholder = options.startPlaceholder || 'End date';
    this.fxFlex = options.fxFlex === undefined ? 0 : options.fxFlex;
    this.startRequired = !!options.startRequired || !!options.required;
    this.endRequired = !!options.endRequired || !!options.required;
  }
}

export interface DateRangeOptions extends BaseOptions<Moment> {
  startRequired?: boolean;
  endRequired?: boolean;
  startPlaceholder?: string;
  endPlaceholder?: string;
}
