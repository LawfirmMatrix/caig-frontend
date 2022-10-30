import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  first,
  map,
  skip,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {Observable, of, ReplaySubject} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {
  FieldBase,
  CheckboxField,
  InputField,
  PhoneNumberField,
  SelectField,
  FieldMenu,
  InputButton
} from 'dynamic-form';
import {isEqual, omitBy} from 'lodash-es';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'notifications';
import {Employee} from '../../../../models/employee.model';
import {isNotUndefined, participationRowPainter} from '../../../../core/util/functions';
import {ToolbarButton} from '../../../shared/employee/component/toolbar-buttons/toolbar-buttons.component';
import {EmployeeEntityService} from '../../../employees/services/employee-entity.service';
import {PhoneTextComponent, PhoneTextConfig} from '../../../shared/employee/component/phone-text/phone-text.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {bueLocations, participationStatuses} from '../../../../enums/store/selectors/enums.selectors';
import {settlementId, user} from '../../../../core/store/selectors/core.selectors';
import {Role} from '../../../../models/session.model';

@Component({
  selector: 'app-employee-view',
  templateUrl: './employee-view.component.html',
  styleUrls: ['./employee-view.component.scss']
})
export class EmployeeViewComponent implements OnInit, OnDestroy {
  public canEdit = false;
  public employee: Employee | undefined;
  public employeeIndex: number | undefined;
  public allEmployees$ = this.dataService.entities$;
  public statusColor: string | undefined;
  public disableSave = true;
  public gridColumns$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(({matches}) => matches ? 1 : 2));
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'Call List',
      icon: 'chevron_left',
      routerLink: '/call-list',
    },
  ];
  private phoneMenu: FieldMenu = {
    icon: 'more_vert',
    items: [
      {
        name: 'Call',
        icon: 'phone',
        iconColor: 'warn',
        callback: () => this.notifications.showSimpleErrorMessage('Phone call service is currently disabled')
      },
      {
        name: 'TTS Call',
        icon: 'perm_phone_msg',
        iconColor: 'primary',
        callback: () => this.sms(true)
      },
      {
        name: 'Text Message',
        icon: 'sms',
        iconColor: 'primary',
        callback: () => this.sms(false)
      },
    ],
    disabled: (value) => !value,
  };
  private emailButton: (alt?: boolean) => InputButton[] = (alt?: boolean) => [{
    icon: 'send',
    callback: () => this.router.navigate(['../email'], {queryParams: {alt: !!alt}, relativeTo: this.route, queryParamsHandling: 'merge'}),
    color: 'primary',
    tooltip: 'Send Email',
    disabled: (value: string) => !value,
  }];
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new CheckboxField({
        key: 'flsaExempt',
        label: 'FLSA Exempt',
        position: 'start',
      }),
    ],
    [
      new InputField({
        key: 'firstName',
        label: 'First Name',
        required: true,
      }),
      new InputField({
        key: 'middleName',
        label: 'Middle Name/Initial',
      }),
      new InputField({
        key: 'lastName',
        label: 'Last Name',
        required: true,
      }),
    ],
    [
      new PhoneNumberField({
        key: 'phoneWork',
        label: 'Work Phone',
        hint: {message: '', align: 'start'},
        extension: true,
        menu: this.phoneMenu,
        showIcon: false,
        position: 'start',
      }),
    ],
    [
      new PhoneNumberField({
        key: 'phone',
        label: 'Home Phone',
        hint: {message: '', align: 'start'},
        menu: this.phoneMenu,
        showIcon: false,
      }),
      new InputField({
        key: 'email',
        label: 'Email',
        buttons: this.emailButton(),
      }),
    ],
    [
      new PhoneNumberField({
        key: 'phoneCell',
        label: 'Cell Phone',
        hint: {message: '', align: 'start'},
        menu: this.phoneMenu,
        showIcon: false,
      }),
      new InputField({
        key: 'emailAlt',
        label: 'Alt Email',
        buttons: this.emailButton(true),
      })
    ],
    [
      new InputField({
        key: 'jobTitle',
        label: 'Position Title',
      }),
      new InputField({
        key: 'payPlan',
        label: 'Pay Plan',
        fxFlex: 30,
        validators: [Validators.maxLength(2)],
      }),
    ],
    [
      new InputField({
        key: 'series',
        label: 'Series',
        validators: [Validators.maxLength(4)],
      }),
      new InputField({
        key: 'busCode',
        label: 'busCode',
        validators: [Validators.maxLength(4)],
      }),
    ],
    [
      new InputField({
        key: 'grade',
        label: 'Grade',
        validators: [Validators.maxLength(2)],
      }),
      new InputField({
        key: 'step',
        label: 'Step',
        validators: [Validators.maxLength(2)],
      }),
    ],
    [
      new SelectField({
        key: 'bueLocation',
        label: 'Location',
        options: this.store.select(bueLocations).pipe(
          filter(isNotUndefined),
          map((locations) => locations.map((name) => ({name})))
        ),
        itemKey: 'name',
        displayField: 'name',
      })
    ],
    [
      new SelectField({
        key: 'appointmentType',
        label: 'Appointment Type',
        options: of([
          {key: 'hybrid', value: 'Hybrid'},
          {key: 't5', value: 'T5'},
        ]),
        itemKey: 'key',
        displayField: 'value',
      }),
      new InputField({
        key: 'pdNumber',
        label: 'PD Number',
        type: 'number',
      })
    ],
    [
      new InputField({
        key: 'supervisorName',
        label: 'Supervisor Name',
      }),
      new InputField({
        key: 'supervisorEmail',
        label: 'Supervisor Email',
      }),
    ]
  ];
  public participationStatusFields: FieldBase<any>[][] = [
    [
      new SelectField({
        key: 'participationStatus',
        label: 'Participation Status',
        options: this.store.select(participationStatuses).pipe(
          filter(isNotUndefined),
          map((locations) => locations.map((name) => ({name})))
        ),
        itemKey: 'name',
        displayField: 'name',
        optionColor: (o) => participationRowPainter(o.name),
      })
    ]
  ];
  private onDestroy$ = new ReplaySubject<void>();
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: EmployeeEntityService,
    private breakpointObserver: BreakpointObserver,
    private dialog: MatDialog,
    private notifications: NotificationsService,
    private store: Store<AppState>,
  ) {
  }
  public ngOnInit() {
    const user$ = this.store.select(user).pipe(filter(isNotUndefined));
    this.route.params
      .pipe(
        tap((params) => {
          this.employee = undefined;
          this.dataService.getByKey(params['id']);
        }),
        switchMap((params) =>
          this.dataService.entityMap$.pipe(
            map((entityMap) => entityMap[Number(params['id'])])
          )
        ),
        distinctUntilChanged(isEqual),
        filter(isNotUndefined),
        withLatestFrom(user$),
        tap(([employee, user]) => {
          this.employee = employee;
          this.canEdit = user.roleId === Role.Superadmin || user.roleId === Role.Administrator || user.id === employee.userId;
          Object.keys(this.form.value).forEach((key) => (this.form.controls as any)[key].patchValue((employee as any)[key]));
          this.statusColor = participationRowPainter(employee.participationStatus);
          this.disableSave = true;
        }),
        withLatestFrom(this.store.select(settlementId)),
        map(([[employee, user], settlementId]) => employee.settlementId === settlementId),
        tap((inSettlement) => {
          if (!inSettlement) {
            this.dataService.cancel();
          }
        }),
        switchMap((inSettlement) => inSettlement ? this.findEmployeeIndex() : of(null)),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.store.select(settlementId)
      .pipe(
        skip(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => this.router.navigate(['/call-list']));

    this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) => {
        const changes = omitBy({...this.employee, ...value}, (p) => p === undefined);
        this.disableSave = this.form.invalid || isEqual(changes, this.employee);
      });
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next(void 0);
  }
  public cycleTo(bues: Employee[], index: number): void {
    const bue = bues[index];
    this.router.navigate([bue.id, 'view'], {relativeTo: this.route.parent, queryParamsHandling: 'preserve'});
  }
  public save(employee: Employee): void {
    this.disableSave = true;
    const payload: any = omitBy({...employee, ...this.form.value}, (v) => v === undefined);
    payload.series = payload.series || null;
    payload.grade = payload.grade || null;
    payload.step = payload.step || null;
    payload.busCode = payload.busCode || null;
    this.dataService.update(payload)
      .subscribe(() => {
        this.dataService.getByKey(payload.id);
        this.notifications.showSimpleInfoMessage('Successfully updated employee record');
        this.employee = payload;
        this.statusColor = participationRowPainter(payload.participationStatus);
      }, () => this.disableSave = false);
  }
  public sms(tts: boolean): void {
    const config = { ...this.form.value, tts } as PhoneTextConfig;
    this.dialog.open(PhoneTextComponent, {data: config, width: '400px'});
  }
  private findEmployeeIndex(): Observable<any> {
    return this.dataService.loaded$
      .pipe(
        filter((loaded) => loaded),
        switchMap(() => this.dataService.keys$),
        tap((employeeIds) => this.employeeIndex = employeeIds.findIndex((id) => id == this.route.snapshot.params['id']) + 1),
        first(),
      );
  }
}
