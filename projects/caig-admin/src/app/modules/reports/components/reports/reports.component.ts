import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {startCase} from 'lodash-es';
import {TableColumn, TextColumn} from 'vs-table';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {LoadingService} from '../../../../core/services/loading.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  public static readonly SSN_COL: TableColumn<TaxDetail> = new TextColumn({
    title: 'SSN',
    field: 'ssn',
  });
  public componentHeader: string | undefined;
  public canDecrypt = false;
  constructor(public loadingService: LoadingService, public route: ActivatedRoute, private router: Router) { }
  public onActivate(): void {
    const snapshot = this.route.firstChild?.snapshot;
    if (snapshot) {
      const segment = snapshot.url[0];
      const hasSsn = snapshot.data['hasSsn'] === true;
      this.componentHeader = segment ? startCase(segment.path) : undefined;
      this.canDecrypt = hasSsn;
    }
  }
  public decrypt(): void {
    this.loadingService.attach();
    this.router.navigate([], {queryParams: { includeSsn: true }, queryParamsHandling: 'merge', replaceUrl: true});
  }
}
