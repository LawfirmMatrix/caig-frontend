import {Pipe, PipeTransform} from '@angular/core';
import {formatAccounting} from '../utils/consts';

@Pipe({name: 'accounting'})
export class AccountingPipe implements PipeTransform {
  public transform(value: string | null): string | null {
    return formatAccounting(value);
  }
}
