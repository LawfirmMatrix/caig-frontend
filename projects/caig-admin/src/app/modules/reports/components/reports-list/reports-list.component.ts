import {Component} from '@angular/core';
import {reportsList} from '../../reports-routing.module';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent {
  public list: string[] = reportsList
    .map((route) => route.path)
    .filter((path): path is string => !!path);
}
