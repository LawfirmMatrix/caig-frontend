import {of} from 'rxjs';
import * as moment from 'moment';
import {uncertain} from './common';

export const currentDay = moment();
export const nextDay = moment().add(1, 'day');
export const currentYear = currentDay.year();
export const currentMonth = currentDay.month();

export const months$ = of([
  uncertain,
  { key: '1', value: 'January' },
  { key: '2', value: 'February' },
  { key: '3', value: 'March' },
  { key: '4', value: 'April' },
  { key: '5', value: 'May' },
  { key: '6', value: 'June' },
  { key: '7', value: 'July' },
  { key: '8', value: 'August' },
  { key: '9', value: 'September' },
  { key: '10', value: 'October' },
  { key: '11', value: 'November' },
  { key: '12', value: 'December' },
]);

export const years$ = (fromYear: number) => {
  return of(new Array(currentYear - fromYear + 1).fill(fromYear).map((v, i) => {
    const year = String(v + i);
    return { key: year, value: year };
  }));
};
