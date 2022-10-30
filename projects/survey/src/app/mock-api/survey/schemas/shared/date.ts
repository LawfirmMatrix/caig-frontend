import {of} from 'rxjs';
import * as moment from 'moment';
import {uncertain} from './common';

export const current = moment();
export const currentYear = current.year();

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

const years = (count: number) => new Array(count).fill(currentYear);

export const years$ = (count: number) => of([uncertain, ...years(count).map((v, i) => {
  const year = v - i;
  return {key: year.toString(), value: year.toString()};
})]);
