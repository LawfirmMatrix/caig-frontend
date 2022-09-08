import {SelectionModel} from '@angular/cdk/collections';
import {FormControl, FormGroup} from '@angular/forms';

export class ColumnFilter {
  public filter: string = '';
  public noValue: boolean = false;
  public selection = new SelectionModel<string>(true, []);
  public range = new FormGroup({
    start: new FormControl<any | null>(null),
    end: new FormControl<any | null>(null),
  });
  public get isActive(): boolean {
    return !!this.filter || this.noValue || this.selection.hasValue() || !!(this.range.value.start || this.range.value.end);
  }
}
