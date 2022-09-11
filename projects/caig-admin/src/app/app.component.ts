import { Component } from '@angular/core';
import {TableColumn, TextColumn, DateColumn, ChangesColumn, IconColumn, RowClick, SelectionChange, CurrencyColumn} from 'vs-table';
import {HttpClient} from '@angular/common/http';
import {delay} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    // setTimeout(() => this.columns = this.columns.slice(1), 10000);
  }
  public data$ = this.http.get<any[]>('assets/data.json').pipe(delay(1000));
  public columns: TableColumn<any>[] = [
    new TextColumn({
      title: 'Employee',
      field: 'employeeName',
    }),
    new DateColumn({
      title: 'Date',
      field: 'whenCreated',
      format: 'medium',
    }),
    new TextColumn({
      title: 'Message',
      field: 'message',
      fxFlex: 33,
    }),
    new TextColumn({
      title: 'Type',
      field: 'description',
    }),
    new TextColumn({
      title: 'User',
      field: 'user',
    }),
    new ChangesColumn({
      title: 'Changes',
      field: 'changes',
    }),
    new CurrencyColumn({
      title: 'Code',
      field: 'code',
      sum: true,
    }),
    new IconColumn({
      title: 'Even',
      field: 'id',
      calculate: (row) => row.id % 2 === 0 ? 'check' : 'close',
    })
  ];
  public textPainter = (row: any) => row.employeeName.startsWith('CASEY') ? 'red' : '';
  public rowPainter = (row: any) => row.employeeName.startsWith('KENNETH') ? 'blue' : '';
  public preselect = (row: any) => row.id % 2 === 0;
  public rowTooltip = (row: any) => row.employeeName;

  public rowClick(event: RowClick<any>): void {
    console.log(event);
  }

  public rowSelect(event: SelectionChange<any>): void {
    console.log(event);
  }
}
