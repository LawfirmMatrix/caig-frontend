import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Observable, BehaviorSubject, delay, switchMap, of, startWith, debounceTime} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {
  TableColumn,
  TableMenuItem,
  RowMenuItem,
  ExportConfig,
  RowClick,
  SelectionChange,
  TextColumn,
  DateColumn, CurrencyColumn, NumberColumn, CalculateColumn, IconColumn, ChangesColumn, ButtonColumn
} from 'vs-table';
import {Sort} from '@angular/material/sort';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  public refreshData$ = new BehaviorSubject<number>(10000);
  public dataDelay = 1000;

  public height = 600;
  public width = 800;

  public columns: TableColumn<TestItem>[] = [
    new TextColumn({
      title: 'ID',
      field: 'id',
    }),
    new CalculateColumn({
      title: 'Calculation',
      field: 'calc',
      calculate: (row) => {
        const sqrt = Math.sqrt(row.id);
        return sqrt % 1 === 0 ? `${sqrt} x ${sqrt}` : ''
      },
      fxLayoutAlign: 'center center'
    }),
    new TextColumn({
      title: 'Text',
      field: 'text',
    }),
    new DateColumn({
      title: 'Date',
      field: 'date'
    }),
    new CurrencyColumn({
      title: 'Amount',
      field: 'amount',
      sum: true,
    }),
    new NumberColumn({
      title: 'Quantity',
      field: 'quantity',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Total',
      field: 'total',
      sum: true,
    }),
    new IconColumn({
      title: 'Icon',
      field: 'icon',
      calculate: (row) => row.icon,
    }),
    new ChangesColumn({
      title: 'Changes',
      field: 'changes',
    })
  ]
  public data$: Observable<TestItem[] | null> = this.refreshData$
    .pipe(
      debounceTime(200),
      map((length) => length < 0 ? 0 : Math.min(length, 1000000)),
      switchMap((length) =>
        of(data(length)).pipe(
          delay(this.dataDelay),
          startWith(null)
        )
      ),
    );
  public tableMenuItems: TableMenuItem<TestItem>[] | undefined = [];
  public rowMenuItems: RowMenuItem<TestItem>[] | undefined = [];
  public disableRowClick = false;
  public disableSelection = false;
  public disableOptions = false;
  public disableSearch = false;
  public disableSelectAll = false;
  public sort: Sort = { active: '', direction: '' };
  public exportConfig: ExportConfig | undefined;
  public rowTooltip: undefined | ((row: TestItem) => string);
  public rowPainter: undefined | ((row: TestItem) => string);
  public textPainter: undefined | ((row: TestItem) => string);
  public preselect: undefined | ((row: TestItem) => boolean);
  public filter = '';
  public buttonColumns: ButtonColumn<TestItem>[] = [
    {
      title: '',
      position: 'start',
      label: (row) => 'Test',
      color: () => 'primary',
      callback: (row) => console.log(row),
    },
    {
      title: 'Button',
      position: 'end',
      label: (row) => `Log ${row.id}`,
      color: () => 'accent',
      callback: (row) => console.log(row),
    },
  ];

  public rowClickEvent: RowClick<TestItem> | undefined;
  public rowSelectEvent: SelectionChange<TestItem> | undefined;

  public rowCount: number = this.refreshData$.value;

  constructor(private breakpointObserver: BreakpointObserver) { }

  public setRowTooltip(value: string): void {
    this.rowTooltip = value ? ((row: any) => row[value]) : undefined;
  }

  public setTextPainter(value: string): void {
    this.textPainter = value ? ((row) => row.id % 2 === 0 ? value : '') : undefined;
  }

  public setRowPainter(value: string): void {
    this.rowPainter = value ? ((row) => row.id % 4 === 0 ? value : '') : undefined;
  }

  public setPreselect(value: 'odd' | 'even' | ''): void {
    this.preselect = !value ? undefined :
      value === 'even' ? ((row: TestItem) => row.id % 2 === 0) :
        ((row: TestItem) => row.id % 2 !== 0);
  }
}

const iconMap: { [key: number]: string } = {
  0: 'home',
  1: 'check',
  2: 'close',
  3: 'menu',
  4: 'settings',
  5: 'delete',
  6: 'star',
  7: 'toggle_on',
  8: 'bolt',
  9: 'shopping_cart_checkout',
  10: 'do_not_disturb_on',
  11: 'settings_accessibility',
  12: 'library_add',
  13: 'create_new_folder',
};

const generateChanges: () => {field: string, oldValue: any, newValue: any}[] | undefined = () => {
  if (Math.random() < 0.75) {
    return undefined;
  }
  const fields: string[] = ['Date', 'Amount', 'Quantity'];
  return fields.slice(0, Math.ceil(Math.random() * fields.length)).map((field) => ({
    field,
    oldValue: 'A',
    newValue: 'B',
  }))
};

const data: (length: number) => TestItem[] = (length) => Array.from({length}).map((v, id) => {
  const amount = Math.random() * 1000;
  const quantity = Math.ceil(Math.random() * 10);
  return {
    id,
    text: 'dadsp dspsd d, sdiksdi ds'.repeat(Math.ceil(Math.random() * 3)),
    date: randomDate(new Date(2012, 0, 1), new Date()).toLocaleDateString(),
    amount,
    quantity,
    total: amount * quantity,
    icon: iconMap[Math.floor(Math.random() * 14)],
    changes: generateChanges(),
  };
});

interface TestItem {
  id: number;
  calc?: any;
  text: string;
  date: string;
  amount: number;
  quantity: number;
  total: number;
  icon: string;
  changes?: {field: string, oldValue: any, newValue: any}[];
}

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}
