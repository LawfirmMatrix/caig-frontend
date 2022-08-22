import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component, EventEmitter, Input,
  OnChanges,
  OnDestroy,
  OnInit, Output,
  SimpleChanges
} from '@angular/core';
import {
  ExportConfig,
  RowClick,
  RowMenuItem,
  SelectionChange,
  TableColumn,
  TableColumnDataType,
  TableMenuItem
} from '../../utils/interfaces';
import {Sort} from '@angular/material/sort';
import {round, some} from 'lodash-es';

@Component({
  selector: 'vs-table',
  templateUrl: './vs-table.component.html',
  styleUrls: ['./vs-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VsTableComponent<T> implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input() public data: T[] | null = null;
  @Input() public columns: TableColumn<T>[] = [];
  @Input() public disableSelectAll = false;
  @Input() public disableSelection = false;
  @Input() public disableSearch = false;
  @Input() public disableOptions = false;
  @Input() public disableRowClick = false;
  @Input() public sort = VsTableComponent.DEFAULT_SORT;
  @Input() public rowMenuItems: RowMenuItem<T>[] | null | undefined;
  @Input() public tableMenuItems: TableMenuItem<T>[] | null | undefined;
  @Input() public exportConfig: ExportConfig | null | undefined;
  @Input() public rowTooltip: ((row: T) => string) | undefined;
  @Input() public rowPainter: ((row: T) => string) | undefined;
  @Input() public textPainter: ((row: T) => string) | undefined;
  @Input() public preselect: ((row: T) => boolean) | undefined;

  @Output() public rowClick = new EventEmitter<RowClick<T>>();
  @Output() public selectionChange = new EventEmitter<SelectionChange<T>>();

  // @ViewChild(CdkVirtualScrollViewport) public viewport!: CdkVirtualScrollViewport;
  // @ViewChild(MatSort) public matSort!: MatSort;

  public static readonly DEFAULT_SORT: Sort = { active: '', direction: '' };

  public readonly stickyCellWidth = 40;
  public readonly rowHeight = 48;
  public readonly columnWidth = 120;
  public readonly columnDataTypes = {
    text: TableColumnDataType.Text,
    changes: TableColumnDataType.Changes,
    date: TableColumnDataType.Date,
    icon: TableColumnDataType.Icon,
    currency: TableColumnDataType.Currency,
    number: TableColumnDataType.Number,
    calc: TableColumnDataType.Calculate,
  };

  public showFooter = false;
  public minRowWidth = 0;

  constructor() {

  }

  public ngOnInit() {
    console.log(this.data);
  }

  public ngAfterViewInit() {

  }

  public ngOnChanges(changes: SimpleChanges) {
    if (this.columns) {
      this.showFooter = some(this.columns, (c) => c.sum);
      this.minRowWidth = (this.columns.length * this.columnWidth) +
        (this.disableSelection ? 0 : this.rowHeight) +
        (this.rowMenuItems || this.tableMenuItems ? this.rowHeight : 0);
    }
  }

  public ngOnDestroy() {

  }

  public sortChange(event: Sort): void {
    this.sort = event;
    // this.saveCache(['sort']);
  }

  public calculateColumnSum(column: TableColumn<T>): number | undefined {
    console.log(column);
    return this.data?.reduce((prev, curr) =>
      round(prev + Number(curr[column.field] || 0), 2), 0);
  }
}
