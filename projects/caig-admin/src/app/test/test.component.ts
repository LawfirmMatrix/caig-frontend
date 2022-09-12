import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {Observable, BehaviorSubject, delay, switchMap, of, startWith} from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import {TableColumn, TableMenuItem, RowMenuItem, ExportConfig, RowClick, SelectionChange, TextColumn} from 'vs-table';
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

  public refreshData$ = new BehaviorSubject<void>(void 0);
  public dataDelay = 1000;

  public height = 600;
  public width = 800;

  public columns: TableColumn<TestItem>[] = [
    new TextColumn({
      title: 'ID',
      field: 'id',
    }),
  ]
  public data$: Observable<TestItem[] | null> = this.refreshData$
    .pipe(
      switchMap(() =>
        of(data).pipe(
          delay(this.dataDelay),
          startWith(null)
        )
      ),
    );
  public tableMenuItems: TableMenuItem<TestItem>[] = [];
  public rowMenuItems: RowMenuItem<TestItem>[] = [];
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

  public rowClickEvent: RowClick<TestItem> | undefined;
  public rowSelectEvent: SelectionChange<TestItem> | undefined;

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

const data: TestItem[] = Array.from({length: 1000}).map((v, id) => ({ id }));

interface TestItem {
  id: number;
}
