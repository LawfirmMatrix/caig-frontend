import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {TableColumn, TextColumn, CurrencyColumn, CalculateColumn, ButtonColumn, RowMenuItem} from 'vs-table';
import {Payment, Payroll} from '../../../../models/payroll.model';
import {Observable, of, combineLatest, BehaviorSubject} from 'rxjs';
import {formatCurrency, Location} from '@angular/common';
import {MatStepper} from '@angular/material/stepper';
import {UntypedFormGroup} from '@angular/forms';
import {AutocompleteField, FieldBase, InputField, SelectField, DateField} from 'dynamic-form';
import {PayrollEntityService} from '../../services/payroll-entity.service';
import * as moment from 'moment';
import {sumBy} from 'lodash-es';
import {NotificationsService} from 'notifications';

@Component({
  selector: 'app-add-to-payroll',
  templateUrl: './add-to-payroll.component.html',
  styleUrls: ['./add-to-payroll.component.scss']
})
export class AddToPayrollComponent implements OnInit {
  private static PREVIEW_PARAM = 'preview';
  private preview$: Observable<Payroll> = this.route.data.pipe(map((data) => data[AddToPayrollComponent.PREVIEW_PARAM]));
  private pendingPayroll$: Observable<Payroll[]> = this.dataService.entities$.pipe(
    map((payrolls) => payrolls.filter((p) => p.status === 'Pending'))
  );
  public payments$ = new BehaviorSubject<Payment[]>([]);
  public warningPayments$ = this.payments$.pipe(
    map((payments) => payments.filter((p) => !p.okToPay))
  );
  public totalSum$ = this.payments$.pipe(
    map((payments) => sumBy(payments, (p) => p.total))
  );
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
      backgroundColor: (row) => row.okToPay ? 'rgba(37,171,14,0.5)' : 'rgba(219,18,21,0.5)',
    })
  ];
  public buttonColumns: ButtonColumn<Payment>[] = [
    {
      position: 'start',
      label: (row) => 'Remove',
      color: (row) => 'warn',
      callback: (row, index) => {
        this.payments$.value.splice(index, 1);
        this.payments$.next([...this.payments$.value]);
        if (this.payments$.value.length === 1) {
          this.buttonColumns = [];
        }
      },
      title: '',
      disabled: () => this.isProcessing,
    }
  ];
  public rowMenuItems: RowMenuItem<Payment>[] = [
    {
      name: () => 'View Employee',
      callback: (row) => this.router.navigate(['/employees', row.employeeId, 'view']),
    }
  ];
  public canCancel = (this.location.getState() as {navigationId: number}).navigationId > 1;
  public steps: PayrollStep[] = [
    {
      label: 'Create or Merge',
    },
    {
      label: 'Payroll Info',
    },
    {
      label: 'Review & Finalize',
    },
  ];
  public pendingForm = new UntypedFormGroup({});
  public payrollForm = new UntypedFormGroup({});
  public pendingField = new AutocompleteField({
    key: 'payrollId',
    label: 'Pending payrolls',
    options: this.pendingPayroll$,
    itemKey: 'id',
    displayField: 'memo',
    required: true,
  });
  public payrollFields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'memo',
        label: 'Memo',
        required: true,
      }),
    ],
    [
      new SelectField({
        key: 'status',
        label: 'Status',
        options: of([{value: 'Pending'}, {value: 'Processed'}]),
        itemKey: 'value',
        displayField: 'value',
        required: true,
        value: 'Pending',
      })
    ],
    [
      new DateField({
        key: 'date',
        label: 'Date',
        required: true,
        value: moment(),
      })
    ]
  ];
  public selectedPayroll: Payroll | undefined;
  public isProcessing = false;
  constructor(
    public location: Location,
    public dataService: PayrollEntityService,
    private route: ActivatedRoute,
    private router: Router,
    private notifications: NotificationsService,
  ) {
  }
  public ngOnInit() {
    this.payrollForm.statusChanges
      .subscribe((status) => this.steps[1].completed = status === 'VALID');
    this.preview$
      .subscribe((preview) => this.payments$.next(preview.payments));
    combineLatest([this.pendingForm.valueChanges, this.dataService.entityMap$])
      .subscribe(([value, entityMap]) => this.selectedPayroll = entityMap[value['payrollId']]);
  }

  public newOrMerged(step: PayrollStep, stepper: MatStepper, merged: boolean): void {
    if (!merged && this.selectedPayroll) {
      this.selectedPayroll = undefined;
      this.pendingForm.reset();
      this.payrollForm.patchValue({memo: ''});
    }
    step.completed = true;
    setTimeout(() => stepper.next());
  }

  public save(): void {
    const opts = {emitEvent: false};
    this.payrollForm.disable(opts);
    this.pendingForm.disable(opts);
    this.isProcessing = true;
    const payroll: any = {
      ...this.route.snapshot.data[AddToPayrollComponent.PREVIEW_PARAM],
      ...this.payrollForm.value,
    };
    console.log(payroll);
    // const request$: Observable<any> = payroll.id ? this.dataService.patch(payroll) : this.dataService.add(payroll);
    // request$.subscribe(() => {
    //   this.notifications.showSimpleInfoMessage(`Successfully ${payroll.id ? 'updated' : 'created'} payroll`);
    //   this.router.navigate(['/payrolls']);
    // });
  }
}

interface PayrollStep {
  label: string;
  completed?: boolean;
}
