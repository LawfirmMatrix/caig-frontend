import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {startCase} from 'lodash-es';
import {TableColumn, TextColumn} from 'vs-table';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {LoadingService} from '../../../../core/services/loading.service';
import {Subject, Observable, ReplaySubject, filter} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  public static readonly SSN_COL: TableColumn<TaxDetail> = new TextColumn({
    title: 'SSN',
    field: 'ssn',
  });
  public onActivate$ = new ReplaySubject<any>();
  public componentHeader$: Observable<string | undefined> = this.onActivate$
    .pipe(
      map(() => {
        const snapshot = this.route.firstChild?.snapshot;
        return snapshot && snapshot.url[0] ? startCase(snapshot.url[0].path) : undefined;
      })
    );
  public canDecrypt$: Observable<boolean> = this.onActivate$
    .pipe(
      map(() => {
        const snapshot = this.route.firstChild?.snapshot;
        return !!snapshot && snapshot.data['hasSsn'];
      })
    );
  private data$ = new Subject<any>();
  constructor(public loadingService: LoadingService, public route: ActivatedRoute, private router: Router) { }
  public ngOnInit() {
    this.onActivate$.pipe(
      filter((component) => component.data$ instanceof Observable),
      switchMap((component) => component.data$),
      filter((data) => !!data),
    )
      .subscribe(() => this.loadingService.detach());
  }
  public toggleEncryption(): void {
    this.router.navigate([], {queryParams: { includeSsn: this.route.snapshot.queryParams['includeSsn'] !== 'true' }, queryParamsHandling: 'merge', replaceUrl: true})
      .then(() => this.loadingService.attach());
  }
}
