import {Component, OnInit, OnDestroy} from '@angular/core';
import {switchMap, shareReplay, map, takeUntil} from 'rxjs/operators';
import {filter, startWith, ReplaySubject, Observable} from 'rxjs';
import {RespondentDataService} from '../../services/respondent-data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {EmployeeEntityService} from '../../../employees/services/employee-entity.service';
import {ThemeService} from '../../../../theme/theme.service';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {Theme} from '../../../../theme/theme.types';
import {Employee} from '../../../../models/employee.model';
import {Location} from '@angular/common';
import {EmployeeInfoComponent} from '../employee-info/employee-info.component';
import {RowMenuItem, TableColumn, TextColumn} from 'vs-table';

@Component({
  selector: 'app-link-respondent',
  templateUrl: './link-respondent.component.html',
  styleUrls: ['./link-respondent.component.scss']
})
export class LinkRespondentComponent implements OnInit, OnDestroy {
  private static RESPONDENT_ID_PARAM = 'respondentId';
  public respondent$ = this.route.params
    .pipe(
      switchMap((params) => this.respondentService.getOne(params[LinkRespondentComponent.RESPONDENT_ID_PARAM])),
      shareReplay(1),
    );
  public pdfUrl$ = this.respondent$
    .pipe(
      filter((respondent) => !!respondent.pdfId),
      switchMap((respondent) => this.respondentService.getPDF(respondent.pdfId as string)),
      map((respondent) => this.domSanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(respondent))),
      startWith(this.domSanitizer.bypassSecurityTrustResourceUrl('')),
    );
  public employees$: Observable<Employee[]> = this.employeesService.entities$;
  public isProcessing = false;
  public columns: TableColumn<Employee>[] = [
    new TextColumn({
      title: 'Name',
      field: 'name',
    }),
    new TextColumn({
      title: 'Job Title',
      field: 'jobTitle',
    }),
    new TextColumn({
      title: 'Phone',
      field: 'phone',
    }),
    new TextColumn({
      title: 'Email',
      field: 'email',
    }),
  ];
  public rowPainter: ((row: Employee) => string) | undefined;
  public rowMenuItems: RowMenuItem<Employee>[] = [
    {
      name: () => 'More Info',
      callback: (data) => this.moreInfo(data)
    }
  ];
  public selectedEmployee: Employee | undefined;
  private onDestroy$ = new ReplaySubject<void>();
  constructor(
    private respondentService: RespondentDataService,
    private route: ActivatedRoute,
    private router: Router,
    private domSanitizer: DomSanitizer,
    private employeesService: EmployeeEntityService,
    private themeService: ThemeService,
    private notifications: NotificationsService,
    private dialog: MatDialog,
    private location: Location
  ) { }
  public ngOnInit() {
    let theme: Theme;
    this.themeService.currentTheme$
      .pipe(takeUntil(this.onDestroy$))
      .subscribe((t) => theme = t);
    this.rowPainter = (row) => row === this.selectedEmployee ? theme?.accent : '';
  }
  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }
  public link(employee?: Employee): void {
    if (employee) {
      this.isProcessing = true;
      this.respondentService.patch(this.route.snapshot.params[LinkRespondentComponent.RESPONDENT_ID_PARAM], {employeeId: employee.id})
        .subscribe(() => {
          this.location.back();
          this.notifications.showSimpleInfoMessage('Successfully linked to BUE');
        }, () => this.isProcessing = false);
    }
  }
  public moreInfo(data: Employee): void {
    this.dialog.open(EmployeeInfoComponent, {data, maxHeight: '600px'});
  }
}
