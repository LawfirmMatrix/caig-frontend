import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {uniq} from 'lodash-es';
import {TableColumn} from '../../../utils/interfaces';
import {IconColumn} from '../../../column-types/icon-column';
import {BehaviorSubject} from 'rxjs';
import {ColumnFilter} from '../column-filter';

@Component({
  selector: 'vs-table-icon-filter',
  templateUrl: './icon-filter.component.html',
  styleUrls: ['./icon-filter.component.scss']
})
export class IconFilterComponent<T> implements OnInit, OnChanges {
  @Input() public disabled!: boolean;
  @Input() public data: T[] | null = null;
  @Input() public filteredData!: T[];
  @Input() public column!: TableColumn<T>;
  @Input() public columnFilter$!: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  public readonly rowHeight = 64;
  public readonly columns = 4;
  public uniqueColumnValues: string[] = [];
  public selection!: SelectionModel<string>;
  private filterOptions = false;
  public get viewportHeight(): number {
    return this.rowHeight * Math.ceil(this.uniqueColumnValues.length / this.columns) + 5;
  }
  public ngOnInit() {
    this.selection = this.columnFilter$.value[this.column.field].selection;
    this.selection.changed.subscribe(() => this.columnFilter$.next(this.columnFilter$.value));
  }
  public ngOnChanges(changes: SimpleChanges) {
    const data: T[] | undefined = changes['data']?.currentValue;
    const filteredData: T[] = changes['filteredData']?.currentValue;
    if (data || (filteredData && this.filterOptions)) {
      this.calculateUniqueColumnValues();
    }
  }
  public filterOptionsToggle(checked: boolean): void {
    this.filterOptions = checked;
    if (this.data) {
      this.calculateUniqueColumnValues();
    }
  }
  private calculateUniqueColumnValues(): void {
    if (!this.data) {
      return;
    }
    const data = this.filterOptions ? this.filteredData : this.data;
    this.uniqueColumnValues = uniq(data
      .filter((row) => row[this.column.field] !== null && row[this.column.field] !== undefined)
      .map((this.column as IconColumn<T>).calculate)
    );
  }
}
