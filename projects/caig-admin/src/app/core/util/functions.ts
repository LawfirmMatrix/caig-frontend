import {formatNumber} from '@angular/common';
import {ParticipationStatus} from '../../models/employee.model';

export function isNotUndefined<T>(input: T | undefined): input is T {
  return input !== undefined;
}

export function concatName(entity: {firstName: string, middleName?: string, lastName: string}): string {
  return `${entity.firstName} ${entity.middleName ? entity.middleName + ' ' : ''}${entity.lastName}`;
}

export function zeroPad(value: number | undefined, padding: number): string {
  return value === undefined ? '' : formatNumber(value, 'en-us', `${padding}.0-0`).replace(',', '');
}

export function participationRowPainter(participationStatus: ParticipationStatus): string {
  switch (participationStatus) {
    case ParticipationStatus.NoContact:
      return 'rgb(209,42,17)';
    case ParticipationStatus.InProgress:
      return 'rgb(217,186,28)';
    case ParticipationStatus.Completed:
      return 'rgb(29,163,11)';
    default:
      return '';
  }
}

export function generatePassword(passwordLength: number) {
  const numberChars = '0123456789';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const allChars = numberChars + upperChars + lowerChars;
  let randPasswordArray = Array(passwordLength);
  randPasswordArray[0] = numberChars;
  randPasswordArray[1] = upperChars;
  randPasswordArray[2] = lowerChars;
  randPasswordArray = randPasswordArray.fill(allChars, 3);
  return shuffleArray(randPasswordArray.map((x) => x[Math.floor(Math.random() * x.length)])).join('');
}

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
