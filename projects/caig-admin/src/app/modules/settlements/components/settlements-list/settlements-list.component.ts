import {Component, OnInit} from '@angular/core';
import {TableColumn, TextColumn, RowMenuItem, CurrencyColumn, DateColumn, IconColumn} from 'vs-table';
import {Router, ActivatedRoute} from '@angular/router';
import {LoadingService} from '../../../../core/services/loading.service';
import {SettlementEntityService} from '../../services/settlement-entity.service';
import {Settlement} from '../../../../models/settlement.model';
import {rowIcon, rowColor} from '../../../surveys/components/respondents-list/respondents-list';
import {withLatestFrom, map} from 'rxjs/operators';

@Component({
  selector: 'app-settlements-list',
  templateUrl: './settlements-list.component.html',
  styleUrls: ['./settlements-list.component.scss']
})
export class SettlementsListComponent implements OnInit {
  public settlements$ = this.dataService.entities$
    .pipe(
      withLatestFrom(this.dataService.loaded$),
      map(([entities, loaded]) => loaded ? entities : null)
    );
  public columns: TableColumn<Settlement>[] = [
    new TextColumn({
      title: 'ID',
      field: 'id',
    }),
    new TextColumn({
      title: 'Code',
      field: 'code',
    }),
    new TextColumn({
      title: 'Type',
      field: 'type',
    }),
    new CurrencyColumn({
      title: 'Liability Amount',
      field: 'liabilityAmount',
    }),
    new DateColumn({
      title: 'Date',
      field: 'date',
    }),
    new TextColumn({
      title: 'Plaintiff Name',
      field: 'plaintiffName'
    }),
    new TextColumn({
      title: 'Plaintiff Attorney Name',
      field: 'plaintiffAttorneyName'
    }),
    new TextColumn({
      title: 'Defendant Name',
      field: 'defendantName'
    }),
    new TextColumn({
      title: 'Defendant Attorney Name',
      field: 'defendantAttorneyName'
    }),
    new TextColumn({
      title: 'Title',
      field: 'title',
    }),
    new TextColumn({
      title: 'Title Long',
      field: 'titleLong'
    }),
    new TextColumn({
      title: 'Email',
      field: 'adminEmail',
    }),
    new TextColumn({
      title: 'Phone',
      field: 'adminPhone',
    }),
    new TextColumn({
      title: 'Fax',
      field: 'adminFax',
    }),
    new IconColumn({
      title: 'Donate',
      field: 'canDonate',
      calculate: rowIcon('canDonate'),
      color: rowColor('canDonate'),
    }),
    new IconColumn({
      title: 'Public',
      field: 'isPublic',
      calculate: rowIcon('isPublic'),
      color: rowColor('isPublic'),
    }),
    new IconColumn({
      title: 'Open',
      field: 'isOpen',
      calculate: rowIcon('isOpen'),
      color: rowColor('isOpen'),
    })
  ];
  public rowMenuItems: RowMenuItem<Settlement>[] = [
    {
      name: () => 'Delete',
      callback: (row) => this.loadingService.load(this.dataService.delete(row.id)),
    }
  ];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: SettlementEntityService,
    private loadingService: LoadingService,
  ) { }
  public ngOnInit() {

  }
  public editSettlement(settlement: Settlement): void {
    this.router.navigate([settlement.id], {relativeTo: this.route});
  }
}
