import {Component, OnDestroy, OnInit} from '@angular/core';
import {EmployeesTableConfigService, IEmployeeViewMode, EmployeeViewMode} from './employees-table-config.service';
import {combineLatest, noop, Observable, of, Subject} from 'rxjs';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, ChipsField, InputField, SelectField} from 'dynamic-form';
import {
  filter,
  map,
  skip,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import {chunk, flatten, isArray, omitBy} from 'lodash-es';
import {Employee} from '../../../../models/employee.model';
import {isNotUndefined} from '../../../../core/util/functions';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'notifications';
import {ThemeService} from '../../../../theme/theme.service';
import {AssignUserComponent} from '../../../../core/components/assign-user/assign-user.component';
import {EmployeeEntityService} from '../../services/employee-entity.service';
import {TableMenuItem, RowMenuItem, TableColumn} from 'vs-table';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {ToolbarButton} from '../../../shared/employee/component/toolbar-buttons/toolbar-buttons.component';
import {settlementId, settlements} from '../../../../core/store/selectors/core.selectors';
import {
  bueLocals, bueLocations,
  bueRegions,
  employeeStatusesFlat,
  settlementStates
} from '../../../../enums/store/selectors/enums.selectors';
import {QueryParams} from '@ngrx/data';
import {usersForSettlement} from '../../../users/store/selectors/user.selectors';
import {yesOrNo$} from '../../../../core/util/consts';
import {LoadingService} from '../../../../core/services/loading.service';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss'],
  providers: [EmployeesTableConfigService]
})
export class EmployeesListComponent implements OnInit, OnDestroy {
  private onDestroy$ = new Subject<void>();
  private settlementId$ = this.store.select(settlementId).pipe(filter(isNotUndefined));
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'New Registration',
      icon: 'add_circle',
      callback: noop,
      disabled: true,
    },
    {
      label: 'New Employee',
      icon: 'add_circle',
      routerLink: '/employees/new'
    },
    {
      label: 'Export',
      icon: 'download',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Upload Employees',
      icon: 'cloud_upload',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Update from Experian',
      icon: 'upload',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Update from CSV',
      icon: 'upload',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Update Amounts',
      icon: 'upload',
      callback: noop,
      disabled: true,
    },
  ];
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'search',
        label: 'Name',
      }),
      new SelectField({
      key: 'status',
      label: 'Status',
      itemKey: 'name',
      displayField: 'displayName',
      options: this.store.select(employeeStatusesFlat).pipe(
        filter(isNotUndefined)
      ),
      deselect: true,
    }),
      new SelectField({
        key: 'state',
        label: 'State',
        itemKey: 'value',
        displayField: 'value',
        options: this.store.select(settlementStates).pipe(
          map((states) => states ? states.map((value) => ({value})) : null)
        ),
        deselect: true,
      }),
      new SelectField({
        key: 'contactQuality',
        label: 'Contact?',
        displayField: 'value',
        itemKey: 'value',
        options: of([]).pipe(map((x) => x.map((value) => ({value})))),
        deselect: true,
      }),
      new ChipsField({
        key: 'tags',
        label: 'Tags',
        options: of([]),
      })
    ],
    [
      new SelectField({
        key: 'bueRegion',
        label: 'BUE Region',
        multiple: true,
        displayField: 'name',
        itemKey: 'name',
        options: this.store.select(bueRegions).pipe(
          map((states) => states ? states.map((name) => ({name})) : null),
        ),
      }),
      new SelectField({
        key: 'bueLocal',
        label: 'BUE Local',
        multiple: true,
        displayField: 'name',
        itemKey: 'name',
        options: this.store.select(bueLocals).pipe(
          map((states) => states ? states.map((name) => ({name})) : null),
        ),
        deselect: true,
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
        key: 'bueCurrent',
        label: 'Current BUE',
        itemKey: 'value',
        displayField: 'name',
        options: yesOrNo$,
        deselect: true,
      }),
      new SelectField({
        key: 'bueUnionMember',
        label: 'Union Member',
        itemKey: 'value',
        displayField: 'name',
        options: yesOrNo$,
        deselect: true,
      }),
    ],
    [
      new SelectField({
        key: 'allSettlementIds',
        label: 'Settlements',
        options: this.store.select(settlements).pipe(filter(isNotUndefined)),
        itemKey: 'id',
        displayField: 'code',
        multiple: true,
        deselect: true,
        optionFilter: {
          label: 'Open Only',
          filter: (settlement) => settlement.isOpen,
        }
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
      new SelectField({
        key: 'needsCall',
        label: 'Assignment & Contact Status',
        options: of([]).pipe(map((x) => x.map((name) => ({name})))),
        itemKey: 'name',
        displayField: 'name',
        deselect: true,
      }),
      new SelectField({
        key: 'deceased',
        label: 'Deceased',
        itemKey: 'value',
        displayField: 'name',
        options: yesOrNo$,
        deselect: true,
      }),
    ]
  ];
  public handsetFields: FieldBase<any>[][] = chunk(flatten(this.fields), 1);
  public tableMenuItems: TableMenuItem<Employee>[] = [
    {
      name: () => 'Bulk assign',
      callback: (rows) => this.assignUser(rows),
    },
    {
      name: () => 'Bulk add to payroll',
      callback: (rows) => this.addToPayroll(rows),
    },
    {
      name: () => 'Bulk email',
      callback: (rows) => this.bulkEmail(rows),
    }
  ];
  public rowMenuItems: RowMenuItem<Employee>[] = [
    {
      name: () => 'Assign',
      callback: (row) => this.assignUser([row]),
    },
    {
      name: () => 'Add to payroll',
      callback: (row) => this.addToPayroll([row]),
    },
    {
      name: () => 'View',
      callback: (row) => this.viewEmployee(row),
    },
    {
      name: () => 'Edit',
      callback: (row) => this.router.navigate([row.id, 'edit'], {relativeTo: this.route.parent})
    },
    {
      name: () => 'Delete',
      callback: (row) => {
        const data: ConfirmDialogData = {
          title: 'Confirm Delete',
          text: `Are you sure you want to delete ${row.name}?`,
          confirmText: 'Yes',
        };
        this.dialog.open(ConfirmDialogComponent, {data})
          .afterClosed()
          .pipe(
            filter((res) => res),
            switchMap(() => this.loadingService.load(this.employeeService.delete(row.id)))
          )
          .subscribe(
            () => this.notifications.showSimpleInfoMessage(`Successfully deleted ${row.name}`),
          );
      },
    }
  ];
  public viewModes: IEmployeeViewMode[] = [
    {
      displayName: 'Basic',
      name: 'basic',
    },
    {
      displayName: 'BUE',
      name: 'bue',
    },
    {
      displayName: 'Financial',
      name: 'financial',
    },
  ];
  public model$: Observable<FilterModel> = this.route.queryParams.pipe(
    map((qp) => sanitizeModel({
      ...qp,
      tags: mapStringArrToModel(qp, 'tags'),
      bueRegion: mapStringArrToModel(qp, 'bueRegion'),
      bueLocal: mapStringArrToModel(qp, 'bueLocal'),
      bueLocation: mapStringArrToModel(qp, 'bueLocation'),
      userId: mapNumberArrToModel(qp, 'userId'),
      allSettlementIds: mapNumberArrToModel(qp, 'allSettlementIds'),
    }))
  );
  public employees$!: Observable<Employee[] | null>;
  public viewMode: EmployeeViewMode = 'basic';
  public tableColumns!: TableColumn<Employee>[];
  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(({matches}) => matches));
  public expandFilters = !!Object.keys(this.route.snapshot.queryParams).length;
  public settlementIdPainter: ((row: Employee) => string) | undefined;
  public rowTooltip: ((row: Employee) => string) | undefined;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeEntityService,
    private tableConfig: EmployeesTableConfigService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private notifications: NotificationsService,
    private themeService: ThemeService,
    private store: Store<AppState>,
    private loadingService: LoadingService,
  ) {
  }
  public ngOnInit() {
    this.setColumns(this.viewMode);

    const employees$ = combineLatest([this.employeeService.loaded$, this.employeeService.entities$])
      .pipe(
        map(([loaded, employees]) => loaded ? employees : null)
      );

    this.employees$ = this.model$
      .pipe(
        switchMap((model) => hasKeys(model) ?
          this.employeeService.getWithQuery(model as QueryParams).pipe(startWith(null)) : employees$
        )
      );

    this.settlementId$
      .pipe(
        skip(1),
        tap(() => {
          this.employeeService.clearCache();
          if (this.employeeService.activeCorrelationId) {
            this.employeeService.cancel();
          }
        }),
        switchMap(() => this.employeeService.getAll()),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => this.resetFilters());

    combineLatest([this.themeService.currentTheme$, this.settlementId$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([theme, settlementId]) => {
        this.settlementIdPainter = (row) => settlementId && settlementId !== row.settlementId ? theme.isDark ? 'rgba(210,210,210,0.9)' : 'rgba(50,50,50,0.7)' : '';
        this.rowTooltip = (row) => settlementId && settlementId !== row.settlementId ? `This employee belongs to a different settlement - ${row.settlementCode} (ID: ${row.settlementId})` : '';
      });
  }
  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }
  public viewEmployee(employee: Employee): void {
    this.router.navigate([employee.id, 'view'], {relativeTo: this.route.parent});
  }
  public viewModeChange(viewMode: EmployeeViewMode): void {
    this.setColumns(viewMode);
  }
  private setColumns(viewMode: EmployeeViewMode): void {
    this.tableColumns = this.tableConfig.getCols(viewMode);
  }
  public resetFilters(): void {
    this.form.reset();
    this.router.navigate([], {replaceUrl: true});
  }
  public assignUser(employees: Employee[]): void {
    this.dialog.open(AssignUserComponent, {data: employees});
  }
  public applyFilters(): void {
    this.router.navigate([], {queryParams: sanitizeModel(this.form.value), replaceUrl: true});
  }
  private addToPayroll(employees: Employee[]): void {
    this.employeeService.createBatch(employees.map((e) => e.id))
      .subscribe(({batchId}) => this.router.navigate(['/payrolls', 'add', batchId]));
  }
  private bulkEmail(employees: Employee[]): void {
    this.loadingService.load(this.employeeService.createBatch(employees.map((e) => e.id)))
      .subscribe(({batchId}) => this.router.navigate(['batch-email', batchId], {relativeTo: this.route}));
  }
}

interface FilterModel {
  search?: string;
  status?: string;
  state?: string;
  contactQuality?: string;
  tags?: string[];
  bueRegion?: string[];
  bueLocal?: string[];
  bueLocation?: string[];
  currentBue?: boolean;
  unionMember?: boolean;
  userId?: number[];
  needsCall?: string;
  deceased?: boolean;
}

export function mapStringArrToModel(queryParams: any, field: string): any {
  return isArray(queryParams[field]) ? queryParams[field] : queryParams[field] ? [queryParams[field]] : undefined;
}

export function mapNumberArrToModel(queryParams: any, field: string): any {
  return isArray(queryParams[field]) ? queryParams[field].map((id: string) => Number(id)) : queryParams[field] ? [Number(queryParams[field])] : undefined;
}

export function sanitizeModel(model: any): any {
  return omitBy(model, (v) => v === undefined || v === null);
}

export function hasKeys(model: any): boolean {
  return !!Object.keys(model).length;
}
