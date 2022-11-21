import {
  AfterViewInit,
  Component, ElementRef,
  EventEmitter, HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output, QueryList,
  SimpleChanges, ViewChild, ViewChildren
} from '@angular/core';
import {
  ExportConfig,
  RowClick,
  RowMenuItem,
  SelectionChange, TableCache,
  TableColumn,
  TableColumnDataType,
  TableMenuItem, ButtonColumn, ExpandRowConfig, NewRowBadge
} from '../../utils/interfaces';
import {Sort} from '@angular/material/sort';
import {intersection, omit, orderBy, round, some, cloneDeep} from 'lodash-es';
import {SelectionModel} from '@angular/cdk/collections';
import {moveItemInArray} from '@angular/cdk/drag-drop';
import {
  auditTime,
  BehaviorSubject,
  filter,
  debounceTime,
  distinctUntilChanged,
  map,
  merge,
  skip,
  Subject,
} from 'rxjs';
import {MatInput} from '@angular/material/input';
import {ColumnFilter} from '../column-filter/column-filter';
import moment from 'moment';
import {CalculateColumn} from '../../column-types/calculate-column';
import {CdkVirtualScrollableElement, CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {measureScrollbarWidth} from '../../utils/consts';
import {NgxCsvService} from 'export-csv';
import {ExportDataComponent} from '../export-data/export-data.component';
import {MatDialog} from '@angular/material/dialog';
import {trigger, state, transition, animate, style, keyframes} from '@angular/animations';

@Component({
  selector: 'vs-table',
  templateUrl: './vs-table.component.html',
  styleUrls: ['./vs-table.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '*'})),
      state('expanded', style({height: '264px'})),
      transition('collapsed => expanded', [
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)', keyframes([
          style({ height: '48px' }),
          style({ height: '264px' })
        ]))
      ]),
      transition('expanded => collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
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
  @Input() public buttonColumns: ButtonColumn<T>[] | undefined;
  @Input() public expandRowConfig: ExpandRowConfig<T> | undefined;

  @Output() public rowClick = new EventEmitter<RowClick<T>>(true);
  @Output() public selectionChange = new EventEmitter<SelectionChange<T>>(true);

  @ViewChild(CdkVirtualScrollableElement) public scrollingElement!: CdkVirtualScrollableElement;
  @ViewChild(CdkVirtualScrollViewport) public viewport!: CdkVirtualScrollViewport;
  @ViewChild('footer') public footerRow!: ElementRef;

  @ViewChildren(MatInput) public inputs!: QueryList<MatInput>;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.onWindowResize$.next(void 0);
  }
  @HostListener('window:beforeunload', ['$event'])
  public onBeforeUnload() {
    this.clearCache(['scrollOffset', 'sort']);
  }

  public static readonly DEFAULT_SORT: Sort = { active: '', direction: '' };
  public static readonly SCROLLBAR_WIDTH: number = measureScrollbarWidth();

  public readonly stickyCellWidth = 40;
  public readonly rowHeight = 48;
  public readonly headerHeight = 56;
  public readonly columnWidth = 135;
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
  public readonly scrollbarWidth = VsTableComponent.SCROLLBAR_WIDTH;
  public readonly onWindowResize$ = new Subject<void>();
  public readonly noValuePlaceholder = 'No Value';

  public padScrollbar = false;
  public showFooter = false;
  public minRowWidth = 0;
  public mouseoverColumn: TableColumn<T> | null = null;
  public filteredData: T[] = [];
  public visibleColumns: TableColumn<T>[] = [];
  public columnSummaries: {[key: string]: number} = {};
  public buttonColumnsStart: ButtonColumn<T>[] | undefined;
  public buttonColumnsEnd: ButtonColumn<T>[] | undefined;
  public calcColumnPrefix = '_';
  public expandRow: T | null = null;
  public expandedRows: any[] = [];

  private cacheKey: string | undefined;
  private scrollToOffset: number | undefined;
  private unsortedFilteredData: T[] = [];
  private resizeObserver = new ResizeObserver(() => this.viewport.checkViewportSize());
  private verticalScrollPosition: number | null = null;
  private _data: any[] = [];

  constructor(
    private csvService: NgxCsvService,
    private dialog: MatDialog,
    private elementRef: ElementRef,
  ) { }

  public ngOnInit(): void {
    this.applyCache();

    merge(this.filter$, this.columnFilter$)
      .pipe(
        skip(2),
        debounceTime(200)
      )
      .subscribe(() => this.filterData());

    this.onWindowResize$
      .pipe(debounceTime(500))
      .subscribe(() => this.measureViewportScroll());

    this.selection.changed
      .subscribe((event) => this.selectionChange.emit({
        added: event.added,
        removed: event.removed,
        selection: event.source.selected,
        isAllSelected: this.isAllSelected(),
      }));
  }

  public ngAfterViewInit(): void {
    this.scrollingElement.elementScrolled()
      .pipe(
        filter(() => this.showFooter && !!this.data),
        auditTime(25),
        map((event) => (event.target as HTMLElement).scrollLeft),
        distinctUntilChanged(),
      )
      .subscribe((left) => this.translateFooter(left));

    this.initializeScrollOffset();

    this.resizeObserver.observe(this.scrollingElement.getElementRef().nativeElement);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const data = changes['data'];
    const hasData = data?.currentValue;
    const hasSort = changes['sort']?.currentValue;
    const hasColumns = changes['columns']?.currentValue;
    if (hasColumns || hasData) {
      this.initializeData();
    }
    if (hasColumns) {
      this.applyCache('columns');
      this.setVisibleColumns();
      this.calculateColumnSummaries();
      this.removeOldColumnFilters();
      this.initializeColumnFilters();
    }
    if (hasData || changes['filter']?.currentValue || hasSort) {
      this.filterData();
    }
    if (hasData) {
      this.selection.clear();
      this.preselectRows();
      this.initializeScrollOffset();
    }
    if (data && !hasData) {
      this.filteredData = [];
    }
    const preselect = changes['preselect'];
    if (preselect?.currentValue) {
      this.preselectRows();
    }
    if (changes['buttonColumns']) {
      this.buttonColumnsStart = this.buttonColumns?.filter((b) => b.position === 'start');
      this.buttonColumnsEnd = this.buttonColumns?.filter((b) => b.position === 'end');
    }
  }

  public ngOnDestroy(): void {
    this.saveCache(['scrollOffset']);
    this.resizeObserver.disconnect();
  }

  public selectAllToggle(): void {
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

  public onRowClick(row: T, index: number): void {
    if (!this.disableRowClick) {
      this.rowClick.emit({ row, index });
    }
  }

  public sortData(event: Sort = this.sort): void {
    this.sort = event;
    if (!event || !event.active || !event.direction) {
      this.filteredData = this.unsortedFilteredData.slice();
      return;
    }
    const column = this.columns.find((c) => c.field === event.active);
    const calculate = column?.calculate;
    const sortBy = calculate ? (this.calcColumnPrefix + event.active) : event.active;
    this.filteredData = orderBy(this.filteredData, (row: any) => typeof row[sortBy] === 'string' ? row[sortBy].toLowerCase() : row[sortBy], event.direction);
    this.saveCache(['sort']);
  }

  public changeColumnOrder(previousIndex: number, currentIndex: number): void {
    const prevColIndex = this.columns.findIndex((c) => c === this.visibleColumns[previousIndex]);
    const currColIndex = this.columns.findIndex((c) => c === this.visibleColumns[currentIndex]);
    moveItemInArray(this.visibleColumns, previousIndex, currentIndex);
    moveItemInArray(this.columns, prevColIndex, currColIndex);
    this.saveCache(['columns']);
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
    this.saveCache(['columns']);
  }

  public buttonColumnClick(event: MouseEvent, column: ButtonColumn<T>, row: T, index: number): void {
    event.stopPropagation();
    column.callback(row, index);
  }

  public clearAllFilters(): void {
    const columnFilters = this.columnFilter$.value;
    for (let columnFiltersKey in columnFilters) {
      columnFilters[columnFiltersKey].reset();
    }
    this.inputs.forEach((input) => input.value = '');
    this.filter$.next('');
  }

  public exportData(): void {
    const columns = this.filterHiddenColumns();
    if (!this.exportConfig) {
      this.dialog.open(ExportDataComponent, { width: '250px' })
        .afterClosed()
        .pipe(filter((filename) => !!filename))
        .subscribe((filename) => this.csvService.download(this.filteredData, columns, filename));
    } else {
      this.csvService.download(this.filteredData, columns, this.exportConfig.filename);
    }
  }

  public resetCached(): void {
    this.clearCache();
    if (this.columns) {
      this.setVisibleColumns();
    }
  }

  public toggleVerticalScrollLock(): void {
    this.verticalScrollPosition = this.verticalScrollPosition === null ? this.viewport.scrollable.getElementRef().nativeElement.scrollTop : null;
  }

  public onViewportScroll(): void {
    if (this.verticalScrollPosition !== null) {
      this.viewport.scrollable.getElementRef().nativeElement.scrollTo({top: this.verticalScrollPosition});
    }
  }

  public toggleExpandRows(row: T, config: ExpandRowConfig<T>): void {
    this.expandRow = this.expandRow === row ? null : row;
    this.expandedRows = this.expandRow ? cloneDeep(config.newRows(row)) : [];
    if (this.expandRow && config.newRowBadge) {
      this.expandedRows.forEach((r: any) => r[this.calcColumnPrefix + config.newRowKey] = (config.newRowBadge as NewRowBadge)(r));
    }
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

  public recalculateRow(index: number): void {
    this.filteredData.splice(index, 1, this.calculateRow(this.filteredData[index], this.getCalcColumns()));
    this.filteredData = [...this.filteredData];
  }

  private calculateRow(row: T, calcColumns: CalculateColumn<T>[]): T {
    const calculatedValues: any = { };
    calcColumns.forEach((col) => calculatedValues[this.calcColumnPrefix + col.field] = col.calculate(row));
    return { ...row, ...calculatedValues };
  }

  private getCalcColumns(): CalculateColumn<T>[] {
    return this.columns.filter((c) => !!c.calculate) as CalculateColumn<T>[];
  }

  private removeOldColumnFilters(): void {
    const fields: string[] = this.columns.map((c) => c.field);
    const columnFilters = this.columnFilter$.value;
    Object.keys(columnFilters)
      .filter((field) => fields.indexOf(field) === -1)
      .forEach((field) => this.columnFilter$.next(omit(this.columnFilter$.value, field)));
  }

  private setVisibleColumns(): void {
    this.visibleColumns = this.filterHiddenColumns();

    this.showFooter = some(this.visibleColumns, (c) => c.sum);

    this.minRowWidth = (this.visibleColumns.length * this.columnWidth) +
      (this.disableSelection ? 0 : this.rowHeight) +
      (this.rowMenuItems || this.tableMenuItems ? this.rowHeight : 0) +
      (this.expandRowConfig ? this.columnWidth : 0) +
      (this.buttonColumns ? (this.buttonColumns.length * this.columnWidth) : 0);

    if (this.showFooter) {
      setTimeout(() => {
        if (this.scrollingElement) {
          this.translateFooter(this.scrollingElement.measureScrollOffset('left'));
        }
      });
    }
  }

  private filterData(): void {
    const columnFilters = this.columnFilter$.value;

    this.filteredData = this.filter$.value ?
      this._data.filter((row) => JSON.stringify(row).toLowerCase().includes(this.filter$.value.toLowerCase())) : this._data;

    for (let columnFiltersKey in columnFilters) {
      if (columnFilters[columnFiltersKey].isActive) {
        this.filterByColumn(columnFilters[columnFiltersKey]);
      }
    }

    this.unsortedFilteredData = this.filteredData.slice();
    this.calculateColumnSummaries();
    this.sortData();
    this.measureViewportScroll();
    this.saveCache(['filter']);
  }

  private filterByColumn(columnFilter: ColumnFilter): void {
    if (columnFilter.filter) {
      const filter = columnFilter.filter.toLowerCase();
      const changesFilter = (row: any) => !!row.changes?.find((change: any) =>
        `${change.oldValue}`.toLowerCase().includes(filter) || `${change.newValue}`.toLowerCase().includes(filter));
      const inverseChangesFilter = (row: any) => !row.changes?.find((change: any) =>
        `${change.oldValue}`.toLowerCase().includes(filter) || `${change.newValue}`.toLowerCase().includes(filter));
      const filterFunc = columnFilter.column.calculate ?
        ((row: any) => (columnFilter.column as CalculateColumn<T>).calculate(row).includes(filter)) :
        columnFilter.column.dataType === this.columnDataTypes.changes ? changesFilter :
        ((row: any) => `${row[columnFilter.column.field]}`.toLowerCase().includes(filter));
      const inverseFilterFunc = columnFilter.column.calculate ?
        ((row: any) => !(columnFilter.column as CalculateColumn<T>).calculate(row).includes(filter)) :
        columnFilter.column.dataType === this.columnDataTypes.changes ? inverseChangesFilter :
          ((row: any) => !`${row[columnFilter.column.field]}`.toLowerCase().includes(filter));
      this.filteredData = this.filteredData.filter(columnFilter.invert ? inverseFilterFunc : filterFunc);
    }

    if (columnFilter.noValue) {
      const noValue = ['', null, undefined];
      const filterFunc = (row: any) => noValue.indexOf(row[columnFilter.column.field]) > -1;
      const inverseFilterFunc = (row: any) => noValue.indexOf(row[columnFilter.column.field]) === -1;
      this.filteredData = this.filteredData.filter(columnFilter.invert ? inverseFilterFunc : filterFunc);
    }

    if (columnFilter.range.value.start || columnFilter.range.value.end) {
      if (columnFilter.range.value.start && columnFilter.range.value.end) {
        const getValue = columnFilter.column.dataType === this.columnDataTypes.currency ||
          columnFilter.column.dataType === this.columnDataTypes.number ?
          ((row: any) => row[columnFilter.column.field]) :
          ((row: any) => `${row[columnFilter.column.field]}`.toLowerCase());
        const dateFilter = (row: any) => {
          const value = new Date(getValue(row));
          const m = moment.utc(value);
          return m.isValid() &&
            m.isBetween(columnFilter.range.value.start, columnFilter.range.value.end, 'date', '[]');
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
          return value.isValid() &&
            value.isSame(columnFilter.range.value.start || columnFilter.range.value.end, 'date');
        };
        const defaultFilter = (row: any) =>
          row[columnFilter.column.field] == columnFilter.range.value.start || columnFilter.range.value.end;
        const filterFunc = columnFilter.column.dataType === this.columnDataTypes.date ? dateFilter : defaultFilter;
        this.filteredData = this.filteredData.filter(filterFunc);
      }
    }

    if (columnFilter.selection.hasValue()) {
      const filterFunc = columnFilter.column.dataType === this.columnDataTypes.changes ?
        ((row: any) => !!(row.changes &&
          intersection(row.changes.map((change: any) => change.field), columnFilter.selection.selected).length)) :
        columnFilter.column.calculate ? ((row: any) =>
            columnFilter.selection.selected.indexOf((columnFilter.column as CalculateColumn<T>).calculate(row)) > -1) :
          ((row: any) => columnFilter.selection.selected.indexOf(`${row[columnFilter.column.field]}`) > -1);
      const inverseFilterFunc = columnFilter.column.dataType === this.columnDataTypes.changes ?
        ((row: any) => !(row.changes &&
          intersection(row.changes.map((change: any) => change.field), columnFilter.selection.selected).length)) :
        columnFilter.column.calculate ? ((row: any) =>
            columnFilter.selection.selected.indexOf((columnFilter.column as CalculateColumn<T>).calculate(row)) === -1) :
          ((row: any) => columnFilter.selection.selected.indexOf(`${row[columnFilter.column.field]}`) === -1);
      this.filteredData = this.filteredData.filter(columnFilter.invert ? inverseFilterFunc : filterFunc);
    }
  }

  private measureViewportScroll(): void {
    setTimeout(() => {
      if (this.viewport) {
        const renderedSize = this.viewport.measureRenderedContentSize();
        const size = this.viewport.getViewportSize();
        this.padScrollbar = renderedSize + this.headerHeight >= size;
      }
    });
  }

  private calculateColumnSummaries(): void {
    this.columns
      .filter((c) => c.sum)
      .forEach((c) =>
        this.columnSummaries[c.field] = this.filteredData.reduce((prev, curr) =>
          round(prev + Number(curr[c.field] || 0), 2), 0));
  }

  private filterHiddenColumns(): TableColumn<T>[] {
    return this.columns.filter((c) => !c.hide);
  }

  private acquireCacheKey(): void {
    this.cacheKey = this.elementRef.nativeElement.id ?
      `vs-table-${this.elementRef.nativeElement.id}` : undefined;
  }

  private applyCache(field?: keyof TableCache<T>): void {
    this.acquireCacheKey();
    if (this.cacheKey) {
      const cache = localStorage.getItem(this.cacheKey);
      if (cache) {
        const parsed: TableCache<T> = JSON.parse(cache);
        if ((!field || field === 'columns') && parsed.columns) {
          parsed.columns.forEach((column, to) => {
            const from = this.columns.findIndex((c) => c.field === column.field);
            if (from > -1) {
              this.columns[from].hide = column.hide;
              moveItemInArray(this.columns, from, to);
            }
          });
          this.setVisibleColumns();
        }
        if ((!field || field === 'filter') && parsed.filter) {
          this.filter = parsed.filter;
          this.filter$.next(parsed.filter);
        }
        if ((!field || field === 'scrollOffset') && parsed.scrollOffset) {
          this.scrollToOffset = parsed.scrollOffset;
        }
        if ((!field || field === 'sort') && parsed.sort) {
          this.sort = parsed.sort;
        }
      }
    }
  }

  private clearCache(fields?: (keyof TableCache<T>)[]): void {
    this.acquireCacheKey();
    if (this.cacheKey) {
      const cache = localStorage.getItem(this.cacheKey);
      if (cache) {
        const parsed: TableCache<T> = JSON.parse(cache);
        if (fields) {
          fields.forEach((field) => delete parsed[field]);
          localStorage.setItem(this.cacheKey, JSON.stringify(parsed));
        } else {
          localStorage.removeItem(this.cacheKey);
        }
      }
    }
  }

  private saveCache(fields: (keyof TableCache<T>)[]): void {
    this.acquireCacheKey();
    if (this.cacheKey) {
      const cache = localStorage.getItem(this.cacheKey);
      const payload: TableCache<T> = cache ? JSON.parse(cache) : {};
      fields.forEach((field) => {
        switch (field) {
          case 'columns':
            payload[field] = this.columns.map(({field, hide}) => ({field, hide: !!hide}));
            break;
          case 'filter':
            payload[field] = this.filter$.value;
            break;
          case 'scrollOffset':
            payload[field] = this.viewport.measureScrollOffset();
            break;
          case 'sort':
            payload[field] = this.sort;
        }
      });
      localStorage.setItem(this.cacheKey, JSON.stringify(payload));
    }
  }

  private initializeScrollOffset(): void {
    setTimeout(() => {
      if (this.scrollToOffset) {
        this.viewport.scrollToOffset(this.scrollToOffset);
      }
    });
  }

  private preselectRows(): void {
    if (this.data && this.preselect) {
      this.selection.clear();
      this.selection.select(...this._data.filter(this.preselect));
    }
  }

  private translateFooter(leftOffset: number): void {
    if (this.footerRow) {
      this.footerRow.nativeElement.style.transform = `translateX(${-leftOffset}px)`
    }
  }

  private initializeData(): void {
    if (this.data && this.columns) {
      const calcColumns = this.getCalcColumns();
      this._data = this.data.map((row) => this.calculateRow(row, calcColumns));
    }
  }
}
