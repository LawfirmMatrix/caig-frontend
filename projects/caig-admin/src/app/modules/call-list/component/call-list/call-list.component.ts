import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableColumn, RowMenuItem, TableMenuItem, TextColumn, CalculateColumn} from 'vs-table';
import {ActivatedRoute, Router} from '@angular/router';
import {cloneDeep, chunk, flatten, isEqual, omit, pick} from 'lodash-es';
import {distinctUntilChanged, filter, map, skip, startWith, switchMap, takeUntil, tap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, combineLatest, Observable, of, ReplaySubject} from 'rxjs';
import {Employee, ParticipationStatus} from '../../../../models/employee.model';
import {isNotUndefined, participationRowPainter, zeroPad} from '../../../../core/util/functions';
import {AssignUserComponent} from '../../../../core/components/assign-user/assign-user.component';
import {EmployeeEntityService} from '../../../employees/services/employee-entity.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {isAdmin, settlementId} from '../../../../core/store/selectors/core.selectors';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {FieldBase, InputField, RadioField, SelectField} from 'dynamic-form';
import {
  hasKeys, mapNumberArrToModel,
  mapStringArrToModel,
  sanitizeModel
} from '../../../employees/components/employees-list/employees-list.component';
import {QueryParams} from '@ngrx/data';
import {bueLocations} from '../../../../enums/store/selectors/enums.selectors';
import {usersForSettlement} from '../../../users/store/selectors/user.selectors';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-call-list',
  templateUrl: './call-list.component.html',
  styleUrls: ['./call-list.component.scss']
})
export class CallListComponent implements OnInit, OnDestroy {
  public statuses: CallListStatuses[] = [
    { name: ParticipationStatus.NoContact, color: participationRowPainter(ParticipationStatus.NoContact) },
    { name: ParticipationStatus.InProgress, color: participationRowPainter(ParticipationStatus.InProgress) },
    { name: ParticipationStatus.Completed, color: participationRowPainter(ParticipationStatus.Completed) },
    { name: ParticipationStatus.CannotContinue },
    { name: ParticipationStatus.ContactImpossible },
    { name: ParticipationStatus.NotACandidate },
    { name: ParticipationStatus.Uncooperative },
  ];
  public currentStatuses$ = new BehaviorSubject<ParticipationStatus[]>([]);
  public employees$!: Observable<CallListEmployee[] | null>;
  public columns: TableColumn<CallListEmployee>[] = [
    new TextColumn({
      title: 'ID',
      field: 'id',
    }),
    new TextColumn({
      title: 'Last',
      field: 'lastName',
    }),
    new TextColumn({
      title: 'First',
      field: 'firstName',
    }),
    new TextColumn({
      title: 'Middle',
      field: 'middleName',
    }),
    new TextColumn({
      title: 'Job Title',
      field: 'jobTitle',
    }),
    new TextColumn({
      title: 'Pay Plan',
      field: 'payPlan',
    }),
    new CalculateColumn({
      title: 'Series',
      field: 'series',
      calculate: (row) => zeroPad(row.series, 4),
    }),
    new CalculateColumn({
      title: 'Grade',
      field: 'grade',
      calculate: (row) => zeroPad(row.grade, 2),
    }),
    new TextColumn({
      title: 'BUE Location',
      field: 'bueLocation',
    }),
    new TextColumn({
      title: 'Last Event',
      field: 'lastEvent',
      fxFlex: 25,
    }),
    new TextColumn({
      title: 'Participation',
      field: 'participationStatus',
    }),
    new TextColumn({
      title: 'Assigned',
      field: 'username',
    }),
  ];
  public rowPainter = (row: Employee) => participationRowPainter(row.participationStatus);
  public tableMenuItems$: Observable<TableMenuItem<Employee>[] | null> = this.store.select(isAdmin)
    .pipe(
      map((isAdmin) => isAdmin ? [
        {
          name: () => 'Bulk Assign',
          callback: (rows) => this.assignUser(rows),
        },
      ] : null)
    )
  public rowMenuItems$: Observable<RowMenuItem<Employee>[] | null> = this.store.select(isAdmin)
    .pipe(map((isAdmin) => isAdmin ? [
      {
        name: () => 'Assign',
        callback: (row) => this.assignUser([row]),
      },
    ] : null));
  public expandFilters = !!Object.keys(omit(this.route.snapshot.queryParams, clientSideFilters)).length;
  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(({matches}) => matches));
  public form = new FormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'search',
        label: 'Name',
      }),
      new InputField({
        key: 'jobTitle',
        label: 'Job Title',
      }),
      new SelectField({
        key: 'bueLocation',
        label: 'BUE Location',
        multiple: true,
        itemKey: 'name',
        displayField: 'name',
        options: this.store.select(bueLocations).pipe(
          map((states) => states ? states.map((name) => ({name})) : null),
        ),
        deselect: true,
      }),
      new SelectField({
        key: 'userId',
        label: 'Assigned User(s)',
        options: this.store.select(usersForSettlement).pipe(
          map((states) => states ? states : null),
        ),
        itemKey: 'id',
        displayField: 'name',
        multiple: true,
        deselect: true,
      }),
    ]
  ];
  public removedField = new RadioField({
    key: 'removed',
    label: 'Removed',
    options: of([
      { key: 'ignore', value: 'Ignore' },
      { key: 'include', value: 'Include' },
      { key: 'only', value: 'Only' },
    ]),
    fxLayout: 'row',
    onChange: (removed) => {
      this.removed$.next(removed);
      this.router.navigate([], {queryParams: {removed}, queryParamsHandling: 'merge', replaceUrl: true});
    }
  });
  public removed$ = new BehaviorSubject<RemovedFilter>('ignore');
  public handsetFields: FieldBase<any>[][] = chunk(flatten(this.fields), 1);
  public model$: Observable<FilterModel> = this.route.queryParams.pipe(
    map((qp) => omit(qp, clientSideFilters)),
    map((qp) => sanitizeModel({
      ...qp,
      bueLocation: mapStringArrToModel(qp, 'bueLocation'),
      userId: mapNumberArrToModel(qp, 'userId'),
    })),
    distinctUntilChanged(isEqual),
  );
  private onDestroy$ = new ReplaySubject<void>();
  constructor(
    private dataService: EmployeeEntityService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private breakpointObserver: BreakpointObserver,
  ) { }
  public ngOnInit() {
    const queryParams: any = this.route.snapshot.queryParams;
    if (queryParams.removed) {
      this.removed$.next(queryParams.removed);
    }

    if (queryParams.pStatus) {
      this.currentStatuses$.next(queryParams.pStatus);
    }

    const allEmployees$ = combineLatest([this.dataService.loaded$, this.dataService.entities$])
      .pipe(map(([loaded, employees]) => loaded ? employees : null));

    const employees$ = this.model$
      .pipe(
        switchMap((model) => hasKeys(model) ?
          this.dataService.getWithQuery(model as QueryParams).pipe(startWith(null)) : allEmployees$
        ),
      );

    this.employees$ = combineLatest([this.removed$, this.currentStatuses$, employees$])
      .pipe(
        distinctUntilChanged(isEqual),
        map(([removed, statuses, employees]) => this.filterData(employees, statuses, removed))
      );

    this.store.select(settlementId)
      .pipe(
        filter(isNotUndefined),
        skip(1),
        tap(() => {
          this.dataService.clearCache();
          if (this.dataService.activeCorrelationId) {
            this.dataService.cancel();
          }
        }),
        switchMap(() => this.fetchData()),
        takeUntil(this.onDestroy$),
      )
      .subscribe(() => this.resetFilters());
  }
  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }
  public statusChange(status: ParticipationStatus): void {
    const index = this.currentStatuses$.value.indexOf(status);
    const statuses = [...this.currentStatuses$.value];
    if (index > -1) {
      statuses.splice(index, 1);
    } else {
      statuses.push(status);
    }
    this.currentStatuses$.next(statuses);
    this.router.navigate([], { queryParams: { pStatus: statuses }, queryParamsHandling: 'merge', replaceUrl: true });
  }
  public viewEmployee(employee: CallListEmployee): void {
    this.router.navigate([employee.id, 'view'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
  }
  public assignUser(employees: Employee[]): void {
    this.dialog.open(AssignUserComponent, {data: employees});
  }
  public applyFilters(): void {
    this.router.navigate([], {queryParams: sanitizeModel(this.form.value), queryParamsHandling: 'merge', replaceUrl: true});
  }
  public resetFilters(): void {
    this.form.reset();
    const queryParams = pick(this.route.snapshot.queryParams, clientSideFilters);
    this.router.navigate([], {queryParams, replaceUrl: true});
  }
  private fetchData(): Observable<Employee[]> {
    return this.dataService.getWithQuery({includeEvents: 'true'}).pipe(tap(() => this.dataService.setLoaded(true)));
  }
  private filterData(entities: Employee[] | null, statuses: ParticipationStatus[], removed: RemovedFilter): CallListEmployee[] | null {
    if (!entities) {
      return entities;
    }
    let employees = cloneDeep(entities);
    switch (removed) {
      case 'ignore':
        employees = employees.filter((e) => !!e.participationStatus);
        break;
      case 'only':
        employees = employees.filter((e) => !e.participationStatus);
        break;
    }
    const callListEmployees = employees.map((e) => ({...e, lastEvent: e.events[0] ? `${e.events[0].description} (${e.events[0].code}) - ${e.events[0].message}` : ''}));
    return statuses.length ? callListEmployees.filter((e) => statuses.indexOf(e.participationStatus) > -1) : callListEmployees;
  }
}

interface CallListEmployee extends Employee {
  lastEvent: string;
}

interface CallListStatuses {
  name: string;
  color?: string
}

interface FilterModel {

}

const clientSideFilters = ['pStatus', 'removed'];

export type RemovedFilter = 'ignore' | 'include' | 'only';
