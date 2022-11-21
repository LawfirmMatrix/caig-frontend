import {BehaviorSubject} from 'rxjs';
import {ColumnFilter} from '../column-filter';
import {TableColumn} from '../../../utils/interfaces';

export abstract class FilterWithToggles<T> {
  public abstract data: T[] | null;
  public abstract column: TableColumn<T>;
  public abstract columnFilter$: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  public filterOptions = false;
  public inverseFilter = false;
  public filterOptionsToggle(checked: boolean): void {
    this.filterOptions = checked;
    this.onToggle();
  }
  public invertFilter(checked: boolean): void {
    this.inverseFilter = checked;
    const columnFilter = this.columnFilter$.value;
    columnFilter[this.column.field].invert = checked;
    this.columnFilter$.next(columnFilter);
    this.onToggle();
  }
  private onToggle(): void {
    if (this.data) {
      this.calculateUniqueColumnValues();
    }
  }
  protected abstract calculateUniqueColumnValues(): void;
}
