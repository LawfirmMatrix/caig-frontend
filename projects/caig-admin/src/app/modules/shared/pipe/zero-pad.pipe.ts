import {Pipe, PipeTransform} from '@angular/core';
import {zeroPad} from '../../../core/util/functions';

@Pipe({name: 'zeroPad'})
export class ZeroPadPipe implements PipeTransform {
  transform(value: number | undefined, padding: number): any {
    return zeroPad(value, padding);
  }
}
