import { Component } from '@angular/core';
import {TableColumn, TextColumn, DateColumn, ChangesColumn} from 'vs-table';
import {HttpClient} from '@angular/common/http';
import {delay} from 'rxjs';
import {CurrencyColumn} from '../../../vs-table/src/lib/column-types/currency-column';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) { }
  public data$ = this.http.get<any[]>('assets/data.json')
    .pipe(
      delay(1000)
    );
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
    })
  ];
}
