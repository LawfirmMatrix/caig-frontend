import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {TableColumn, TableColumnDataType} from '../../../utils/interfaces';
import {uniq} from 'lodash-es';
import {BehaviorSubject} from 'rxjs';
import {ColumnFilter} from '../column-filter';
import {FilterWithToggles} from '../filter-toggles/filter-with-toggles';

@Component({
  selector: 'vs-table-default-filter',
  templateUrl: './default-filter.component.html',
  styleUrls: ['./default-filter.component.scss']
})
export class DefaultFilterComponent<T> extends FilterWithToggles<T> implements OnInit, OnChanges {
  @Input() public disabled!: boolean;
  @Input() public menuOpen = false;
  @Input() public override data: T[] | null = null;
  @Input() public filteredData!: T[];
  @Input() public valueSelector: ((row: T) => string) | undefined;
  @Input() public override column!: TableColumn<T>;
  @Input() public override columnFilter$!: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  @ViewChild(CdkVirtualScrollViewport) public viewport!: CdkVirtualScrollViewport;
  public currentIndex = 0;
  public uniqueColumnValues: string[] = [];
  public selection!: SelectionModel<string>;
  public readonly rowHeight = 30;
  protected readonly defaultValueSelector = (row: T) => `${row[this.column.field]}`;
  public ngOnInit() {
    this.selection = this.columnFilter$.value[this.column.field].selection;
    this.selection.changed.subscribe(() => this.columnFilter$.next(this.columnFilter$.value));
  }
  public ngOnChanges(changes: SimpleChanges) {
    const data: T[] | undefined = changes['data']?.currentValue;
    const filteredData: T[] = changes['filteredData']?.currentValue;
    if (data || (filteredData && (this.filterOptions || this.inverseFilter))) {
      this.calculateUniqueColumnValues();
    }
    if (changes['menuOpen']?.currentValue) {
      this.viewport.scrollToIndex(this.currentIndex);
      setTimeout(() => this.viewport.checkViewportSize(), 200);
    }
  }
  protected override calculateUniqueColumnValues(): void {
    if (!this.data) {
      return;
    }
    const data = this.filterOptions ? this.filteredData : this.data;
    const isCalculateColumn = this.column.dataType === TableColumnDataType.Calculate;
    const filteredData = isCalculateColumn ? data :
      data.filter((row) => row[this.column.field] !== null && row[this.column.field] !== undefined);
    this.uniqueColumnValues = uniq(filteredData.map(this.valueSelector || this.defaultValueSelector));
    if (isCalculateColumn) {
      this.uniqueColumnValues = this.uniqueColumnValues.filter((value) => value !== '');
    }
  }
}
