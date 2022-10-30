import {DateField, SelectField} from 'dynamic-form';
import {of, Subject} from 'rxjs';
import * as moment from 'moment';
import {FormGroup} from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {current} from './date';
import {SurveyQuestion} from '../../../../survey/survey.service';

const month1Change$ = new Subject<string>();
const month2Change$ = new Subject<string>();

const currentMonth = String(current.month() + 1);
const currentDate = current.date();

const getDays = (yearMonth: string) => {
  if (!yearMonth) {
    return [];
  }
  const daysInMonth = moment(`${yearMonth}-01`).daysInMonth();
  const isCurrentMonth = yearMonth.endsWith(currentMonth);
  const options = isCurrentMonth ? (daysInMonth - currentDate) : daysInMonth;
  const startAt = isCurrentMonth ? (daysInMonth - options + 1) : 1;
  return new Array(options)
    .fill('')
    .map((v, i) => {
      const strVal = String(startAt + i);
      const value = strVal.length === 1 ? `0${strVal}` : strVal;
      return { key: value, value: `${value} - ${getDayLabel(moment(`${yearMonth}-${value}`).day())}` };
    });
};

const getDayLabel = (day: number) => {
  switch (day) {
    case 0:
      return 'Sunday';
    case 1:
      return 'Monday';
    case 2:
      return 'Tuesday';
    case 3:
      return 'Wednesday';
    case 4:
      return 'Thursday';
    case 5:
      return 'Friday';
    case 6:
      return 'Saturday';
    default:
      return '';
  }
};

export const disableMonth = (option: {key: string, value: string}) => {
  const endOfMonth = moment(`${option.key}-01`).endOf('month');
  return endOfMonth.isSame(current, 'day') || endOfMonth.isBefore(current, 'month');
};

export const days$ = (monthChange$: Subject<string>) => monthChange$.pipe(map(getDays), startWith([]));

const disabledDays = [0, 5, 6];

export const disableDay = (formField: string) => (option: {key: string, value: string}, form: FormGroup) => {
  if (form.value[formField]) {
    const date = moment(`${form.value[formField]}-${option.key}`);
    return date.isValid() && (date.diff(moment()) < 0 || (disabledDays.indexOf(date.day()) > -1));
  }
  return false;
};

export const times$ = of([
  { key: '08:30', value: '8:30 AM' },
  { key: '08:45', value: '8:45 AM' },
  { key: '09:00', value: '9:00 AM' },
  { key: '09:15', value: '9:15 AM' },
  { key: '09:30', value: '9:30 AM' },
  { key: '09:45', value: '9:45 AM' },
  { key: '10:00', value: '10:00 AM' },
  { key: '10:15', value: '10:15 AM' },
  { key: '10:30', value: '10:30 AM' },
  { key: '10:45', value: '10:45 AM' },
  { key: '11:00', value: '11:00 AM' },
  { key: '11:15', value: '11:15 AM' },
  { key: '11:30', value: '11:30 AM' },
  { key: '11:45', value: '11:45 AM' },
  { key: '12:00', value: '12:00 PM' },
  { key: '12:15', value: '12:15 PM' },
  { key: '12:30', value: '12:30 PM' },
  { key: '12:45', value: '12:45 PM' },
  { key: '13:00', value: '1:00 PM' },
  { key: '13:15', value: '1:15 PM' },
  { key: '13:30', value: '1:30 PM' },
  { key: '13:45', value: '1:45 PM' },
  { key: '14:00', value: '2:00 PM' },
  { key: '14:15', value: '2:15 PM' },
  { key: '14:30', value: '2:30 PM' },
  { key: '14:45', value: '2:45 PM' },
  { key: '15:00', value: '3:00 PM' },
  { key: '15:15', value: '3:15 PM' },
  { key: '15:30', value: '3:30 PM' },
  { key: '15:45', value: '3:45 PM' },
  { key: '16:00', value: '4:00 PM' },
  { key: '16:15', value: '4:15 PM' },
  { key: '16:30', value: '4:30 PM' },
  { key: '16:45', value: '4:45 PM' },
  { key: '17:00', value: '5:00 PM' },
  { key: '17:15', value: '5:15 PM' },
  { key: '17:30', value: '5:30 PM' },
  { key: '17:45', value: '5:45 PM' },
  { key: '18:00', value: '6:00 PM' },
]);

export const apptMonths$ = of(Array.from({length: 3}).map((v, i) => {
  const date = current.add(i, 'month');
  return {
    key: date.format('YYYY-MM'),
    value: date.format('MMMM, YYYY'),
  };
}));

export const onMonthChange = (dateField: string, dayField: string, changeSubject$: Subject<string>) => (value: string, form: FormGroup) => {
  const day = form.controls[dayField].value;
  if (value && day) {
    form.controls[dateField].patchValue(`${value}-${day}`, {emitEvent: false});
    form.controls[dayField].reset(null, {emitEvent: false});
  }
  changeSubject$.next(value);
};

export const onDayChange = (dateField: string, monthField: string) => (value: string, form: FormGroup) => {
  const month = form.controls[monthField].value;
  if (value && month) {
    form.controls[dateField].patchValue(`${month}-${value}`, {emitEvent: false});
  }
};

export const followUpTimes: SurveyQuestion = {
  question: '',
  fields: [
    [
      new DateField({
        key: 'date1',
        label: 'Date #1',
        hide: true,
      }),
      new SelectField({
        key: 'month1',
        label: 'Month',
        required: true,
        itemKey: 'key',
        displayField: 'value',
        options: apptMonths$,
        onChange: onMonthChange('date1', 'day1', month1Change$),
        optionDisabled: disableMonth,
        deselect: true,
      }),
      new SelectField({
        key: 'day1',
        label: 'Day',
        required: true,
        itemKey: 'key',
        displayField: 'value',
        options: days$(month1Change$),
        optionDisabled: disableDay('month1'),
        onChange: onDayChange('date1', 'month1'),
        deselect: true,
      }),
      new SelectField({
        key: 'time1',
        label: 'Time #1',
        fxFlex: 50,
        required: true,
        options: times$,
        itemKey: 'key',
        displayField: 'value',
        deselect: true,
      }),
    ],
    [
      new DateField({
        key: 'date2',
        label: 'Date #2',
        hide: true,
      }),
      new SelectField({
        key: 'month2',
        label: 'Month',
        itemKey: 'key',
        displayField: 'value',
        options: apptMonths$,
        onChange: onMonthChange('date2', 'day2', month2Change$),
        optionDisabled: disableMonth,
        deselect: true,
      }),
      new SelectField({
        key: 'day2',
        label: 'Day',
        itemKey: 'key',
        displayField: 'value',
        options: days$(month2Change$),
        optionDisabled: disableDay('month2'),
        onChange: onDayChange('date2', 'month2'),
        deselect: true,
      }),
      new SelectField({
        key: 'time2',
        label: 'Time #2',
        fxFlex: 50,
        options: times$,
        itemKey: 'key',
        displayField: 'value',
        deselect: true,
      }),
    ],
  ]
};
