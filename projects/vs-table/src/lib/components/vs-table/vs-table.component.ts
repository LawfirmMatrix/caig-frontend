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
import {orderBy, round, some} from 'lodash-es';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {BehaviorSubject, debounceTime, skip, Subject} from 'rxjs';
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

  public showFooter = false;
  public minRowWidth = 0;
  public mouseoverColumn: TableColumn<T> | null = null;
  public filteredData: T[] = [];
  public visibleColumns: TableColumn<T>[] = [];
  // public columnFilters: {[key: string]: ColumnFilter | undefined } = {};
  public columnSummaries: {[key: string]: number} = {};

  private unsortedFilteredData: T[] = [];

  constructor() {

  }

  public ngOnInit() {
    this.filter$
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

  public clearFilter(input: MatInput, filter$: Subject<string>): void {
    input.value = '';
    filter$.next('');
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

  // public openColumnFilter(column: TableColumn<T>): void {
  //   if (!this.columnFilters[column.field]) {
  //     const columnFilter = this.columnFilterService.create(column);
  //     this.columnFilters[column.field] = columnFilter;
  //     this.subscribeToColumnFilter(columnFilter);
  //     columnFilter.calculateUniqueColumnValues(this.data || []);
  //   }
  //   (this.columnFilters[column.field] as ColumnFilter).menuOpened = true;
  // }

  // public closeColumnFilter(column: TableColumn<T>): void {
  //   if (this.columnFilters[column.field]) {
  //     (this.columnFilters[column.field] as ColumnFilter).menuOpened = false;
  //   }
  // }

  // public clearColumnFilter(column: TableColumn<T>): void {
  //   delete this.columnFilters[column.field];
  //   this.filterData();
  // }
  //
  // private subscribeToColumnFilter(columnFilter: ColumnFilter): void {
  //   const freeForm$ = columnFilter.filter$.pipe(skip(1), debounceTime(VsTableComponent.FILTER_DEBOUNCE_TIME));
  //   merge(freeForm$, columnFilter.selection.changed, columnFilter.filterBlank$).subscribe(() => {
  //     this.filterData();
  //     columnFilter.calculateUniqueColumnValues(this.data || []);
  //   });
  // }

  private setVisibleColumns(): void {
    this.visibleColumns = this.columns.filter((c) => !c.hide);
  }

  private filterData(): void {
    const data = this.data || [];
    this.filteredData = this.filter$.value ? data.filter((row) => JSON.stringify(row).toLowerCase().includes(this.filter$.value.toLowerCase())) : data;
    // for (let columnFiltersKey in this.columnFilters) {
    //   this.filterByColumn(this.columnFilters[columnFiltersKey] as ColumnFilter);
    // }
    this.unsortedFilteredData = this.filteredData.slice();
    this.calculateColumnSummaries();
    this.sortData();
  }

  // private filterByColumn(columnFilter: ColumnFilter): void {
  //   const selectionFilter = (row: any) => columnFilter.selection.selected.indexOf(row[columnFilter.column.field]?.toString()) > -1;
  //   const blankFilter = (row: any) => {
  //     const value = row[columnFilter.column.field];
  //     return value === '' || value === null || value === undefined;
  //   };
  //   const selectionFilterWithBlank = (row: any) => {
  //     const value = row[columnFilter.column.field];
  //     const isBlank = value === '' || value === null || value === undefined;
  //     return isBlank || columnFilter.selection.selected.indexOf(value?.toString()) > -1;
  //   };
  //   const columnSelectionFilter = columnFilter.selection.selected.length && columnFilter.filterBlank$.value ?
  //     selectionFilterWithBlank : columnFilter.filterBlank$.value ? blankFilter : selectionFilter;
  //   if (columnFilter.filterBlank$.value || columnFilter.selection.selected.length) {
  //     switch (columnFilter.column.dataType) {
  //       case TableColumnDataType.Changes:
  //         this.filteredData = []; // @TODO
  //         break;
  //       default:
  //         this.filteredData = this.filteredData.filter(columnSelectionFilter);
  //     }
  //   }
  //   if (columnFilter.filter$.value) {
  //     this.filteredData = this.filteredData.filter((row: any) => JSON.stringify(row[columnFilter.column.field]).toLowerCase().includes(columnFilter.filter$.value.toLowerCase()));
  //   }
  // }

  private calculateColumnSummaries(): void {
    this.columns
      .filter((c) => c.sum)
      .forEach((c) =>
        this.columnSummaries[c.field] = this.filteredData.reduce((prev, curr) =>
          round(prev + Number(curr[c.field] || 0), 2), 0));
  }
}
