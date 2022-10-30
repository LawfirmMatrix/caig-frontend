import {Component, Input} from '@angular/core';
import {KeyValue} from '@angular/common';
import {Employee} from '../../../../../models/employee.model';

@Component({
  selector: 'app-amounts-owed',
  templateUrl: './amounts-owed.component.html',
  styleUrls: ['./amounts-owed.component.scss']
})
export class AmountsOwedComponent {
  @Input() public employee!: Employee;
  public props: KeyValue<keyof Employee, string>[] = [
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
      key: 'estCostShare',
      value: 'Cost Share',
    },
    {
      key: 'estFedWh',
      value: 'Federal Wh'
    },
    {
      key: 'fedAddlamt',
      value: 'Federal+',
    },
    {
      key: 'estEmployerSs',
      value: 'Employer Ss',
    },
    {
      key: 'estEmployeeSs',
      value: 'Employee Ss',
    },
    {
      key: 'estEmployerMc',
      value: 'Employer Mc',
    },
    {
      key: 'estEmployeeMc',
      value: 'Employee Mc',
    },
    {
      key: 'estStateWh',
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
      key: 'estTotal',
      value: 'Total',
    }
  ];
}
