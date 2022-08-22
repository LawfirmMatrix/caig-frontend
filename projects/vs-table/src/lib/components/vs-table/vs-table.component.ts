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
import {SelectionModel} from '@angular/cdk/collections';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Subject} from 'rxjs';

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
  @Input() public filter = '';

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
  public readonly selection = new SelectionModel<T>(true, []);
  public readonly filter$ = new Subject<string>();

  public showFooter = false;
  public minRowWidth = 0;
  public mouseoverColumn: TableColumn<T> | null = null;
  public filteredData: T[] = [];
  public visibleColumns: TableColumn<T>[] = [];

  constructor() {

  }

  public ngOnInit() {

  }

  public ngAfterViewInit() {

  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['columns']?.currentValue) {
      this.showFooter = some(this.columns, (c) => c.sum);
      this.minRowWidth = (this.columns.length * this.columnWidth) +
        (this.disableSelection ? 0 : this.rowHeight) +
        (this.rowMenuItems || this.tableMenuItems ? this.rowHeight : 0);
      this.setVisibleColumns();
    }
    if (changes['data']?.currentValue) {
      this.filteredData = this.data ? this.data.slice() : []; // @TODO
    }
    if (changes['filter']?.currentValue) {
      this.filter$.next(this.filter);
    }
  }

  public ngOnDestroy() {

  }

  public selectAllToggle() {
    this.isAllSelected() ? this.selection.clear() : this.selection.select(...this.filteredData);
  }

  public isAllSelected(): boolean {
    return this.selection.selected.length >= this.filteredData.length;
  }

  public rowSelect(event: MouseEvent, row: T): void {
    event.stopPropagation();
    if (this.selection.selected.length && event.shiftKey) {
      const previouslySelected = this.selection.selected[this.selection.selected.length - 1];
      const previousIndex = this.filteredData.findIndex((r) => r === previouslySelected);
      const currentIndex = this.filteredData.findIndex((r) => r === row);
      const start = currentIndex > previousIndex ? previousIndex : currentIndex;
      const end = currentIndex > previousIndex ? currentIndex : previousIndex;
      this.selection.select(...this.filteredData.slice(start + 1, end));
    }
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

  public changeColumnOrder(event: CdkDragDrop<TableColumn<T>[]>): void {
    console.log(event);
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
    // this.setVisibleColumns();
    // this.saveCache(['columns']);
  }

  public filterRows(filter: string): void {
    this.filter = filter;
    // this.saveCache(['filter']);
  }

  public toggleColumnHide(column: TableColumn<T>, event?: MouseEvent): void {
    event?.stopPropagation();
    column.hide = !column.hide;
    this.setVisibleColumns();
    // this.saveCache(['columns']);
  }

  public exportData(): void {
    // const columns = this.filterHiddenColumns();
    // if (!this.exportConfig) {
    //   this.dialog.open(ExportDataComponent, { width: '250px' })
    //     .afterClosed()
    //     .pipe(filter((filename) => !!filename))
    //     .subscribe((filename) => this.csv.download(this.dataSource.matTableDataSource.data, columns, filename));
    // } else {
    //   this.csv.download(this.dataSource.matTableDataSource.data, columns, this.exportConfig.filename);
    // }
  }

  public resetCached(): void {
    // this.clearCache();
    // if (this.columns) {
    //   this.setVisibleColumns();
    // }
  }

  private setVisibleColumns(): void {
    this.visibleColumns = this.columns.filter((c) => !c.hide);
  }
}
