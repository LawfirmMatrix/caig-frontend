import {Pipe, PipeTransform} from '@angular/core';
import {isNumber} from 'lodash-es';

@Pipe({name: 'transformNum'})
export class TransformNumPipe implements PipeTransform {
  transform(value: any): number {
    return isNumber(value) ? value : 0;
  }
}
