import {Pipe, PipeTransform} from '@angular/core';
import {startCase} from 'lodash-es';

@Pipe({name: 'startCase'})
export class StartCasePipe implements PipeTransform {
  transform(value: any): string {
    return startCase(value);
  }
}
