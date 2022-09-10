import {Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {TableColumn} from '../../../utils/interfaces';
import {uniq} from 'lodash-es';
import {BehaviorSubject} from 'rxjs';
import {ColumnFilter} from '../column-filter';

@Component({
  selector: 'vs-table-default-filter',
  templateUrl: './default-filter.component.html',
  styleUrls: ['./default-filter.component.scss']
})
export class DefaultFilterComponent<T> implements OnInit, OnChanges {
  @Input() public disabled!: boolean;
  @Input() public menuOpen = false;
  @Input() public data: T[] | null = null;
  @Input() public filteredData!: T[];
  @Input() public valueSelector: ((row: T) => string) | undefined;
  @Input() public column!: TableColumn<T>;
  @Input() public columnFilter$!: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  @ViewChild(CdkVirtualScrollViewport) public viewport!: CdkVirtualScrollViewport;
  public currentIndex = 0;
  public uniqueColumnValues: string[] = [];
  public selection!: SelectionModel<string>;
  public readonly rowHeight = 30;
  protected readonly defaultValueSelector = (row: T) => `${row[this.column.field]}`;
  protected filterOptions = false;
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
    if (changes['menuOpen']?.currentValue) {
      this.viewport.scrollToIndex(this.currentIndex);
      setTimeout(() => this.viewport.checkViewportSize(), 200);
    }
  }
  public filterOptionsToggle(checked: boolean): void {
    this.filterOptions = checked;
    if (this.data) {
      this.calculateUniqueColumnValues();
    }
  }
  protected calculateUniqueColumnValues(): void {
    if (!this.data) {
      return;
    }
    const data = this.filterOptions ? this.filteredData : this.data;
    this.uniqueColumnValues = uniq(data
      .filter((row) => row[this.column.field] !== null && row[this.column.field] !== undefined)
      .map(this.valueSelector || this.defaultValueSelector)
    );
  }
}
