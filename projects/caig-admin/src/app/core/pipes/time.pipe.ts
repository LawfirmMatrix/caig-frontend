import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {
  transform(durationInHours: string | number | null, showSeconds = true): string {
    if (durationInHours === undefined || durationInHours === null) {
      return '';
    }
    const hours = hoursToTime(durationInHours, 'hh', true);
    const minutes = hoursToTime(durationInHours, 'mm', true);

    let elapsedTime = hours === '00' ? minutes : hours + ':' + minutes;

    if (showSeconds) {
      const seconds = hoursToTime(durationInHours, 'ss', true);
      elapsedTime += ':' + seconds;
    } else {
      elapsedTime = elapsedTime.toString().startsWith('0') ? elapsedTime.slice(1) : elapsedTime;
    }
    return elapsedTime;
  }
}

function hoursToTime(hours: any, part?: any, prependZero?: any): any {
  const seconds: any = moment.duration(hours, 'hours').asSeconds();
  let hh: any = Math.floor(seconds / 3600);
  let mm: any = Math.floor((seconds - (hh * 3600)) / 60);
  let ss: any = Math.floor(seconds - (hh * 3600) - (mm * 60));

  if (prependZero) {
    if (hh < 10) {
      hh = '0' + hh;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    if (ss < 10) {
      ss = '0' + ss;
    }
  }

  switch (part) {
    case 'hh':
      return hh;
    case 'mm':
      return mm;
    case 'ss':
      return ss;
    default:
      return hh + ':' + mm + ':' + ss;
  }
}
