import {
  AfterViewInit,
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
import {orderBy, round, some} from 'lodash-es';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BehaviorSubject, debounceTime, skip} from 'rxjs';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'vs-table',
  templateUrl: './vs-table.component.html',
  styleUrls: ['./vs-table.component.scss'],
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
  public readonly filter$ = new BehaviorSubject<string>('');

  public showFooter = false;
  public minRowWidth = 0;
  public mouseoverColumn: TableColumn<T> | null = null;
  public filteredData: T[] = [];
  public visibleColumns: TableColumn<T>[] = [];
  public columnFilters: {[key: string]: any} = {}; // @TODO - type
  public columnSummaries: {[key: string]: number} = {};

  constructor() {

  }

  public ngOnInit() {
    this.filter$
      .pipe(skip(1), debounceTime(200))
      .subscribe((filter) => this.filterData(filter, true));
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
      this.calculateColumnSummaries();
    }
    if (changes['data']?.currentValue || changes['filter']?.currentValue || changes['sort']?.currentValue) {
      this.filterData(this.filter$.value, true);
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

  public sortData(event: Sort = this.sort): void {
    this.sort = event;
    if (!event || !event.active || !event.direction) {
      this.filterData(this.filter$.value, false);
      return;
    }
    this.filteredData = orderBy(this.filteredData, event.active, event.direction);
    // this.updateTableCache();
  }

  // public calculateColumnSum(column: TableColumn<T>): number | undefined {
  //   return this.data?.reduce((prev, curr) =>
  //     round(prev + Number(curr[column.field] || 0), 2), 0);
  // }

  public changeColumnOrder(event: CdkDragDrop<TableColumn<T>[]>): void {
    const previousIndex = this.columns.findIndex((c) => c === this.visibleColumns[event.previousIndex]);
    const currentIndex = this.columns.findIndex((c) => c === this.visibleColumns[event.currentIndex]);
    moveItemInArray(this.visibleColumns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.columns, previousIndex, currentIndex);
    // this.setVisibleColumns();
    // this.saveCache(['columns']);
  }

  public clearFilter(input: MatInput): void {
    input.value = '';
    this.filter$.next('');
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

  // public columnFilterMenuToggle(column: TableColumn<T>, opened: boolean): void {
  //   if (!this.columnFilters[column.field]) {
  //     this.columnFilters[column.field] = {};
  //   }
  //   (this.columnFilters[column.field] as ColumnFilter).menuOpened = opened;
  // }

  private setVisibleColumns(): void {
    this.visibleColumns = this.columns.filter((c) => !c.hide);
  }

  private filterData(filter: string, sort: boolean): void {
    const data = this.data || [];
    this.filteredData = filter ? data.filter((row) => JSON.stringify(row).toLowerCase().includes(filter.toLowerCase())) : data;
    this.calculateColumnSummaries();
    if (sort) {
      this.sortData();
    }
  }

  private calculateColumnSummaries(): void {
    this.columns
      .filter((c) => c.sum)
      .forEach((c) =>
        this.columnSummaries[c.field] = this.filteredData.reduce((prev, curr) =>
          round(prev + Number(curr[c.field] || 0), 2), 0));
  }
}
