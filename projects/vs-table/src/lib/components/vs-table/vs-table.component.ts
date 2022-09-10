import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
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
import {intersection, omit, orderBy, round, some} from 'lodash-es';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BehaviorSubject, debounceTime, merge, skip} from 'rxjs';
import {MatInput} from '@angular/material/input';
import {ColumnFilter} from '../column-filter/column-filter';
import moment from 'moment';
import {CalculateColumn} from '../../column-types/calculate-column';

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
  public static readonly FILTER_DEBOUNCE_TIME: number = 200;

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
  public readonly columnFilter$ = new BehaviorSubject<{[key: string]: ColumnFilter}>({});

  public showFooter = false;
  public minRowWidth = 0;
  public mouseoverColumn: TableColumn<T> | null = null;
  public filteredData: T[] = [];
  public visibleColumns: TableColumn<T>[] = [];
  public columnSummaries: {[key: string]: number} = {};

  private unsortedFilteredData: T[] = [];

  constructor() {

  }

  public ngOnInit() {
    merge(this.filter$, this.columnFilter$)
      .pipe(skip(1), debounceTime(VsTableComponent.FILTER_DEBOUNCE_TIME))
      .subscribe(() => this.filterData());
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
      this.removeOldColumnFilters();
      this.initializeColumnFilters();
    }
    if (changes['data']?.currentValue || changes['filter']?.currentValue || changes['sort']?.currentValue) {
      this.filterData();
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
      this.filteredData = this.unsortedFilteredData.slice();
      return;
    }
    this.filteredData = orderBy(this.filteredData, event.active, event.direction);
    // this.saveCache(['sort']);
  }

  public changeColumnOrder(event: CdkDragDrop<TableColumn<T>[]>): void {
    const previousIndex = this.columns.findIndex((c) => c === this.visibleColumns[event.previousIndex]);
    const currentIndex = this.columns.findIndex((c) => c === this.visibleColumns[event.currentIndex]);
    moveItemInArray(this.visibleColumns, event.previousIndex, event.currentIndex);
    moveItemInArray(this.columns, previousIndex, currentIndex);
    // this.saveCache(['columns']);
  }

  public clearFilter(input: MatInput): void {
    input.value = '';
    this.filter$.next('');
  }

  public resetColumnFilter(input: MatInput, column: TableColumn<T>): void {
    input.value = '';
    const columnFilter = this.columnFilter$.value;
    columnFilter[column.field].reset();
    this.columnFilter$.next(columnFilter);
  }

  public columnFilterClear(input: MatInput, column: TableColumn<T>): void {
    input.value = '';
    const columnFilter = this.columnFilter$.value;
    columnFilter[column.field].filter = '';
    this.columnFilter$.next(columnFilter);
  }

  public columnFilterChange(column: TableColumn<T>, filter: string): void {
    const columnFilters = this.columnFilter$.value;
    columnFilters[column.field].filter = filter;
    this.columnFilter$.next(columnFilters);
  }

  public toggleColumnHide(column: TableColumn<T>, event?: MouseEvent): void {
    event?.stopPropagation();
    column.hide = !column.hide;
    this.setVisibleColumns();
    // this.saveCache(['columns']);
  }

  public exportData(): void {
    // @TODO
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
    // @TODO
    // this.clearCache();
    // if (this.columns) {
    //   this.setVisibleColumns();
    // }
  }

  private initializeColumnFilters(): void {
    const columnFilters: { [key: string]: ColumnFilter } = this.columnFilter$.value;
    this.columns
      .filter((column) => !columnFilters[column.field])
      .forEach((column) => columnFilters[column.field] = new ColumnFilter(column));
    this.columnFilter$.next(columnFilters);
  }

  public toggleColumnNoValue(column: TableColumn<T>, checked: boolean): void {
    const columnFilters: any = this.columnFilter$.value;
    columnFilters[column.field].noValue = checked;
    this.columnFilter$.next(columnFilters);
  }

  private removeOldColumnFilters(): void {
    const fields: string[] = this.columns.map((c) => c.field);
    const columnFilters = this.columnFilter$.value;
    Object.keys(columnFilters)
      .filter((field) => fields.indexOf(field) === -1)
      .forEach((field) => this.columnFilter$.next(omit(this.columnFilter$.value, field)));
  }

  private setVisibleColumns(): void {
    this.visibleColumns = this.columns.filter((c) => !c.hide);
  }

  private filterData(): void {
    const data = this.data || [];
    const columnFilters = this.columnFilter$.value;
    this.filteredData = this.filter$.value ? data.filter((row) => JSON.stringify(row).toLowerCase().includes(this.filter$.value.toLowerCase())) : data;
    for (let columnFiltersKey in columnFilters) {
      if (columnFilters[columnFiltersKey].isActive) {
        this.filterByColumn(columnFilters[columnFiltersKey]);
      }
    }
    this.unsortedFilteredData = this.filteredData.slice();
    this.calculateColumnSummaries();
    this.sortData();
  }

  private filterByColumn(columnFilter: ColumnFilter): void {
    if (columnFilter.filter) {
      const filter = columnFilter.filter.toLowerCase();
      const changesFilter = (row: any) => !!row.changes?.find((change: any) => `${change.oldValue}`.toLowerCase().includes(filter) || `${change.newValue}`.toLowerCase().includes(filter));
      const filterFunc = columnFilter.column.calculate ?
        ((row: any) => (columnFilter.column as CalculateColumn<T>).calculate(row).includes(filter)) :
        columnFilter.column.dataType === this.columnDataTypes.changes ? changesFilter :
        ((row: any) => `${row[columnFilter.column.field]}`.toLowerCase().includes(filter));
      this.filteredData = this.filteredData.filter(filterFunc);
    }

    if (columnFilter.noValue) {
      this.filteredData = this.filteredData.filter((row: any) => ['', null, undefined].indexOf(row[columnFilter.column.field]) > -1);
    }

    if (columnFilter.range.value.start || columnFilter.range.value.end) {
      if (columnFilter.range.value.start && columnFilter.range.value.end) {
        const getValue = columnFilter.column.dataType === this.columnDataTypes.currency || columnFilter.column.dataType === this.columnDataTypes.number ?
          ((row: any) => row[columnFilter.column.field]) : ((row: any) => `${row[columnFilter.column.field]}`.toLowerCase());
        const dateFilter = (row: any) => {
          const value = new Date(getValue(row));
          const m = moment.utc(value);
          return m.isValid() && m.isBetween(columnFilter.range.value.start, columnFilter.range.value.end, 'date', '[]');
        };
        const defaultFilter = (row: any) => {
          const value = getValue(row);
          return columnFilter.range.value.start <= value && value <= columnFilter.range.value.end;
        };
        const filterFunc = columnFilter.column.dataType === this.columnDataTypes.date ? dateFilter : defaultFilter;
        this.filteredData = this.filteredData.filter(filterFunc);
      } else {
        const dateFilter = (row: any) => {
          const value = moment.utc(row[columnFilter.column.field]);
          return value.isValid() && value.isSame(columnFilter.range.value.start || columnFilter.range.value.end, 'date');
        };
        const defaultFilter = (row: any) => row[columnFilter.column.field] == columnFilter.range.value.start || columnFilter.range.value.end;
        const filterFunc = columnFilter.column.dataType === this.columnDataTypes.date ? dateFilter : defaultFilter;
        this.filteredData = this.filteredData.filter(filterFunc);
      }
    }

    if (columnFilter.selection.hasValue()) {
      const filterFunc = columnFilter.column.dataType === this.columnDataTypes.changes ?
        ((row: any) => !!(row.changes && intersection(row.changes.map((change: any) => change.field), columnFilter.selection.selected).length)) :
        columnFilter.column.calculate ?
        ((row: any) => columnFilter.selection.selected.indexOf((columnFilter.column as CalculateColumn<T>).calculate(row)) > -1) :
        ((row: any) => columnFilter.selection.selected.indexOf(`${row[columnFilter.column.field]}`) > -1);
      this.filteredData = this.filteredData.filter(filterFunc);
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
