import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {NgxCsvService} from 'export-csv';
import {RespondentDataService} from '../../../services/respondent-data.service';
import {ColumnConfigService} from '../column-config.service';
import {LiunaVaComponent} from './liuna-va.component';

@Component({
  selector: 'app-nffe-178-apg',
  templateUrl: '../respondents-list.html',
  styleUrls: ['../respondents-list.scss']
})
export class Nffe178ApgComponent extends LiunaVaComponent {
  constructor(
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override notifications: NotificationsService,
    protected override dialog: MatDialog,
    protected override csvService: NgxCsvService,
    protected override dataService: RespondentDataService,
    protected override columnConfigService: ColumnConfigService,
  ) {
    super(router, route, notifications, dialog, csvService, dataService, columnConfigService);
  }
}
