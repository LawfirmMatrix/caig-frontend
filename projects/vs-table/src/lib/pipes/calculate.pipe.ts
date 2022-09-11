import {Pipe, PipeTransform} from '@angular/core';
import {TableColumn} from '../utils/interfaces';

@Pipe({name: 'calculate'})
export class CalculatePipe implements PipeTransform {
  // include columns arg for triggering pipe refresh. hacky but works
  public transform(row: any, column: TableColumn<any>, columns: TableColumn<any>[] | null): string | number | boolean {
    return column.calculate ? column.calculate(row) : row[column.field];
  }
}
