import {DateField, SelectField} from 'dynamic-form';
import {of} from 'rxjs';
import {currentDay, nextDay} from './date';
import {SurveyQuestion} from '../../../../survey/survey-data.service';
import {Moment} from 'moment';

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
  const date = currentDay.clone().add(i, 'month');
  return {
    key: date.format('YYYY-MM'),
    value: date.format('MMMM, YYYY'),
  };
}));

export const filterDate = (d?: Moment | null) => {
  const day = (d || currentDay).day();
  return day !== 0 && day !== 5 && day !== 6;
};

export const maxDate = currentDay.clone().add(3, 'months').endOf('month');

export const followUpTimes: SurveyQuestion = {
  question: '',
  fields: [
    [
      new DateField({
        key: 'date1',
        label: 'Date #1',
        required: true,
        dateFilter: filterDate,
        min: nextDay,
        max: maxDate,
        openButton: true,
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
        required: true,
        dateFilter: filterDate,
        min: nextDay,
        max: maxDate,
        openButton: true,
      }),
      new SelectField({
        key: 'time2',
        label: 'Time #2',
        fxFlex: 50,
        required: true,
        options: times$,
        itemKey: 'key',
        displayField: 'value',
        deselect: true,
      }),
    ]
  ],
};
