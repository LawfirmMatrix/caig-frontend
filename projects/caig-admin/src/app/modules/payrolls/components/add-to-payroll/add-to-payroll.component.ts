import {Component, OnInit, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map, takeUntil} from 'rxjs/operators';
import {TableColumn, TextColumn, CurrencyColumn, CalculateColumn, RowMenuItem, TableMenuItem} from 'vs-table';
import {Payment, Payroll, PayrollStatus} from '../../../../models/payroll.model';
import {Observable, combineLatest, BehaviorSubject, of, startWith, ReplaySubject, Subject} from 'rxjs';
import {formatCurrency} from '@angular/common';
import {UntypedFormGroup} from '@angular/forms';
import {PayrollEntityService} from '../../services/payroll-entity.service';
import {sumBy, differenceBy, omit} from 'lodash-es';
import {NotificationsService} from 'notifications';
import {EmployeeEntityService} from '../../../employees/services/employee-entity.service';
import {FieldBase, InputField, SelectField, DateField, AutocompleteField} from 'dynamic-form';
import * as moment from 'moment';

@Component({
  selector: 'app-add-to-payroll',
  templateUrl: './add-to-payroll.component.html',
  styleUrls: ['./add-to-payroll.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToPayrollComponent implements OnInit, OnDestroy {
  private static PREVIEW_PARAM = 'preview';
  private static PAYROLL_ID_KEY = 'payrollId';
  private onDestroy$ = new ReplaySubject<void>();
  private payrollIdChange$ = new Subject<string>();
  private selectedPayroll: Payroll | undefined;
  public readonly formModel = {
    memo: '',
    status: PayrollStatus.Pending,
    date: moment(),
  };
  public form = new UntypedFormGroup({});
  public formFields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'memo',
        label: 'Memo',
        required: true,
        appearance: 'standard'
      }),
      new SelectField({
        key: 'status',
        label: 'Status',
        options: of(Object.values(PayrollStatus).map((value) => ({value}))),
        itemKey: 'value',
        displayField: 'value',
        required: true,
        fxFlex: 25,
        appearance: 'standard'
      }),
      new DateField({
        key: 'date',
        label: 'Date',
        required: true,
        appearance: 'standard'
      }),
    ],
  ];
  public columns: TableColumn<Payment>[] = [
    new TextColumn({
      field: 'employeeId',
      title: 'ID',
    }),
    new TextColumn({
      field: 'settlementCode',
      title: 'Settlement',
    }),
    new TextColumn({
      field: 'employeeFirstName',
      title: 'First',
    }),
    new TextColumn({
      field: 'employeeMiddleName',
      title: 'Middle',
    }),
    new TextColumn({
      field: 'employeeLastName',
      title: 'Last',
    }),
    new CurrencyColumn({
      field: 'employeeTotal',
      title: 'Total',
    }),
    new CurrencyColumn({
      field: 'amountPaid',
      title: 'Paid',
    }),
    new CurrencyColumn({
      field: 'amountPending',
      title: 'Pending',
    }),
    new CurrencyColumn({
      field: 'total',
      title: 'This Paycheck',
    }),
    new CalculateColumn({
      field: 'employeePhone',
      title: '+/-',
      calculate: (row) => {
        const amount = row.employeeTotal - row.amountPaid - row.amountPending - row.total;
        return amount === 0 ? '--' : formatCurrency(amount, 'en-us', '$');
      },
      fxLayoutAlign: 'center center',
    }),
    new TextColumn({
      field: 'message',
      title: 'Good to go?',
      backgroundColor: (row) => row.okToPay ? okColor : notOkColor,
    })
  ];
  public tableMenuItems: TableMenuItem<Payment>[] = [
    {
      name: () => 'Bulk Remove from Payroll',
      callback: (rows) => this.removePayments(rows),
      disabled: (rows) => this.asyncAction$.value.isProcessing || rows.length === this.payments$.value.length,
    },
  ];
  public rowMenuItems: RowMenuItem<Payment>[] = [
    {
      name: () => 'View Employee',
      callback: (row) => this.router.navigate(['/employees', row.employeeId, 'view']),
    },
    {
      name: () => 'Remove from Payroll',
      callback: (row) => this.removePayments([row]),
      disabled: () => this.asyncAction$.value.isProcessing || this.payments$.value.length === 1,
    },
  ];
  public asyncAction$ = new BehaviorSubject<{isProcessing: boolean, isSaving: boolean}>({isProcessing: false, isSaving: false});
  public payments$ = new BehaviorSubject<Payment[]>([]);
  public totalSum$ = this.payments$.pipe(
    map((payments) => sumBy(payments, (p) => p.total))
  );
  public warningsCount$: Observable<number> = this.payments$.pipe(
    map((payments) => payments.filter((p) => !p.okToPay).length)
  );
  public selectedPayroll$: Observable<Payroll | undefined> =
    combineLatest([this.form.valueChanges, this.dataService.entityMap$]).pipe(
      map(([value, entityMap]) => entityMap[value[AddToPayrollComponent.PAYROLL_ID_KEY]]),
    );
  public disableSave$!: Observable<boolean>;
  constructor(
    private dataService: PayrollEntityService,
    private employeeService: EmployeeEntityService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationsService,
  ) {
  }
  public ngOnInit() {
    const payrollFormInvalid$ = this.form.statusChanges.pipe(
      map((status) => status !== 'VALID'),
      startWith(true)
    );

    this.disableSave$ = combineLatest([this.asyncAction$, this.warningsCount$, payrollFormInvalid$]).pipe(
      map(([asyncActions, warningsCount, payrollFormInvalid]) => payrollFormInvalid || asyncActions.isProcessing || warningsCount > 0)
    );

    this.route.data.subscribe((data) => {
      const preview = data[AddToPayrollComponent.PREVIEW_PARAM];
      this.payments$.next(preview?.payments || []);
      if (preview && this.formFields.length === 1) {
        this.formFields.unshift([
          new AutocompleteField({
            key: AddToPayrollComponent.PAYROLL_ID_KEY,
            label: 'Pending Payrolls',
            options: this.dataService.entities$.pipe(
              map((payrolls) => payrolls.filter((p) => p.status === 'Pending'))
            ),
            itemKey: 'id',
            displayField: 'memo',
            hint: { message: 'Optionally add payments to an existing payroll', align: 'start' },
            fxFlex: 50,
            appearance: 'standard',
            onChange: (value) => this.payrollIdChange$.next(value),
          }),
        ]);
      }
    });

    combineLatest([this.payrollIdChange$, this.dataService.entityMap$])
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(([payrollId, entityMap]) => {
        const opts = { emitEvent: false };
        const model = payrollId ? entityMap[payrollId] : this.formModel;
        this.selectedPayroll = entityMap[payrollId];
        if (model) {
          this.form.patchValue(model, opts);
        }
        if (payrollId) {
          this.form.disable(opts);
          this.form.controls['payrollId'].enable(opts);
        } else {
          this.form.enable(opts);
        }
      });
  }

  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }

  public save(): void {
    const opts = {emitEvent: false};
    const payroll: any = {
      payments: [],
      ...this.route.snapshot.data[AddToPayrollComponent.PREVIEW_PARAM],
      ...this.selectedPayroll || omit(this.form.value, AddToPayrollComponent.PAYROLL_ID_KEY),
    };
    const request$: Observable<any> = payroll.id ? this.dataService.patch(payroll) : this.dataService.add(payroll);

    this.asyncAction$.next({isProcessing: true, isSaving: true});
    this.form.disable(opts);

    request$.subscribe(() => {
      this.notifications.showSimpleInfoMessage(`Successfully ${payroll.id ? 'updated' : 'created'} payroll`);
      this.router.navigate(['/payrolls']);
    });
  }

  private removePayments(payments: Payment[]): void {
    this.asyncAction$.next({isProcessing: true, isSaving: false});
    const remainingPayments = differenceBy(this.payments$.value, payments, (p) => p.employeeId);
    this.employeeService.createBatch(remainingPayments.map((p) => p.employeeId))
      .subscribe(({batchId}) => {
        this.router.navigate(['add', batchId], {relativeTo: this.route.parent, replaceUrl: true});
        this.asyncAction$.next({isProcessing: false, isSaving: false});
      }, () => this.asyncAction$.next({isProcessing: false, isSaving: false}));
  }
}

export const okColor = 'rgba(37,171,14,0.5)';
export const notOkColor = 'rgba(219,18,21,0.5)';
