import {Component, ViewChild} from '@angular/core';
import {RespondentFlat} from '../respondents-list';
import {VsTableComponent, TableColumn} from 'vs-table';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {NgxCsvService} from 'export-csv';
import {RespondentDataService} from '../../../services/respondent-data.service';
import {ColumnConfigService} from '../column-config.service';
import {NageVaTriageComponent} from './nage-va-triage.component';

@Component({
  selector: 'app-liuna-va',
  templateUrl: '../respondents-list.html',
  styleUrls: ['../respondents-list.scss'],
})
export class LiunaVaComponent extends NageVaTriageComponent {
  @ViewChild(VsTableComponent) public override table!: VsTableComponent<RespondentFlat>;
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
  protected override getColumns(viewMode: string): TableColumn<RespondentFlat>[] {
    const cols = super.getColumns(viewMode);
    return cols.filter((c) => c.field !== 'ppeSurvey');
  }
}
