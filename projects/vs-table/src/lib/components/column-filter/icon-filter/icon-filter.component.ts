import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {uniq} from 'lodash-es';
import {TableColumn} from '../../../utils/interfaces';
import {IconColumn} from '../../../column-types/icon-column';
import {BehaviorSubject} from 'rxjs';
import {ColumnFilter} from '../column-filter';
import {FilterWithToggles} from '../filter-toggles/filter-with-toggles';

@Component({
  selector: 'vs-table-icon-filter',
  templateUrl: './icon-filter.component.html',
  styleUrls: ['./icon-filter.component.scss']
})
export class IconFilterComponent<T> extends FilterWithToggles<T> implements OnInit, OnChanges {
  @Input() public disabled!: boolean;
  @Input() public override data: T[] | null | undefined;
  @Input() public filteredData!: T[];
  @Input() public override column!: TableColumn<T>;
  @Input() public override columnFilter$!: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  public readonly rowHeight = 64;
  public readonly columns = 4;
  public uniqueColumnValues: string[] = [];
  public selection!: SelectionModel<string>;
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
    if (data || (filteredData && (this.filterOptions || this.inverseFilter))) {
      this.calculateUniqueColumnValues();
    }
  }
  protected override calculateUniqueColumnValues(): void {
    if (!this.data) {
      return;
    }
    const data = this.filterOptions ? this.filteredData : this.data;
    this.uniqueColumnValues = uniq(data.map((this.column as IconColumn<T>).calculate));
  }
}
