import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, FormGroup} from '@angular/forms';
import {TableColumn} from '../../utils/interfaces';

export class ColumnFilter {
  public filter: string = '';
  public noValue: boolean = false;
  public selection = new SelectionModel<string>(true, []);
  public range = new FormGroup({
    start: new FormControl<any | null>(null),
    end: new FormControl<any | null>(null),
  });
  constructor(public column: TableColumn<any>) { }
  public get isActive(): boolean {
    return !!this.filter || this.noValue || this.selection.hasValue() || !!(this.range.value.start || this.range.value.end);
  }
  public reset(): void {
    this.filter = '';
    this.noValue = false;
    this.selection.clear();
    this.range.reset();
  }
}
