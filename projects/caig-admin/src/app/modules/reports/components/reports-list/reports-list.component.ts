import {Component} from '@angular/core';
import {reportsList} from '../../reports-routing.module';
import {Routes} from '@angular/router';

@Component({
  selector: 'app-reports-list',
  templateUrl: './reports-list.component.html',
  styleUrls: ['./reports-list.component.scss']
})
export class ReportsListComponent {
  public reports: Routes = reportsList;
}
