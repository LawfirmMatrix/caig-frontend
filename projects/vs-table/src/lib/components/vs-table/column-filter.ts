import {BehaviorSubject} from 'rxjs';
import {SelectionModel} from '@angular/cdk/collections';
import {TableColumn} from '../../utils/interfaces';
import {uniq} from 'lodash-es';

export class ColumnFilter {
  public menuOpened = false;
  public filter$ = new BehaviorSubject<string>('');
  public selection = new SelectionModel<string>(true, []);
  public uniqueColumnValues: string[] = [];
  public get isActive(): boolean {
    return !!this.filter$.value || this.selection.hasValue();
  }
  constructor(public column: TableColumn<any>) { }
  public calculateUniqueColumnValues(data: any[]): void {
    this.uniqueColumnValues = uniq(data
      .filter((row) => row[this.column.field] !== null && row[this.column.field] !== undefined)
      .map((row) => row[this.column.field].toString())
    );
  }
}
