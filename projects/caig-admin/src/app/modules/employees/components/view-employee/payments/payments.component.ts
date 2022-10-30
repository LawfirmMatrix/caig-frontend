import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {KeyValue} from '@angular/common';
import {round} from 'lodash-es';
import {Employee, EmployeePayment} from '../../../../../models/employee.model';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnChanges {
  @Input() public employee!: Employee;
  public props: KeyValue<keyof EmployeePayment, string>[] = [
    {
      key: 'spotBp',
      value: 'SPOT BP',
    },
    {
      key: 'ctotBp',
      value: 'CTOT BP',
    },
    {
      key: 'spotLd',
      value: 'SPOT LD',
    },
    {
      key: 'ctotLd',
      value: 'CTOT LD',
    },
    {
      key: 'costShare',
      value: 'Cost Share',
    },
    {
      key: 'fedWh',
      value: 'Federal Wh'
    },
    {
      key: 'fedAddlamt',
      value: 'Federal+',
    },
    {
      key: 'employerSs',
      value: 'Employer Ss',
    },
    {
      key: 'employeeSs',
      value: 'Employee Ss',
    },
    {
      key: 'employerMc',
      value: 'Employer Mc',
    },
    {
      key: 'employeeMc',
      value: 'Employee Mc',
    },
    {
      key: 'stateWh',
      value: 'State Wh',
    },
    {
      key: 'stateAddlamt',
      value: 'State+',
    },
    {
      key: 'addlamt',
      value: 'Other+'
    },
    {
      key: 'donation',
      value: 'Donation',
    },
    {
      key: 'total',
      value: 'Check Amt',
    },
  ];
  public addlProps: KeyValue<keyof EmployeePaymentView, string>[] = [
    {
      key: 'paidTotal',
      value: '',
    },
    {
      key: 'diff',
      value: '',
    },
  ];
  public payments!: EmployeePaymentView[];
  public summary!: EmployeePaymentView;
  public ngOnChanges(changes: SimpleChanges) {
    if (this.employee.payments) {
      this.payments = this.employee.payments.map((p, i) => {
        const paidTotal = p.total + (this.employee.payments[i - 1] ? this.employee.payments[i - 1].total : 0);
        return { ...p, paidTotal, diff: this.employee.estTotal - paidTotal};
      });
      this.summary = this.props.reduce((prev, curr) => {
        prev[curr.key] = this.payments.reduce((p, c) => round(p + Number(c[curr.key] || 0), 2), 0);
        return prev;
      }, {} as any);
    }
  }
}

interface EmployeePaymentView extends EmployeePayment {
  paidTotal: number;
  diff: number;
}
