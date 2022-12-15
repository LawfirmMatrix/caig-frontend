import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'accounting'})
export class AccountingPipe implements PipeTransform {
  public transform(value: string | null): string | null {
    return formatAccounting(value);
  }
}

export const formatAccounting = (value: string | null) => {
  if (value && value.charAt(0) === '-') {
    return `(${value.substr(1)})`;
  }
  return value;
}
