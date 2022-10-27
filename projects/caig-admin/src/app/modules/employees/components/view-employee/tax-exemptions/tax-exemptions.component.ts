import {Component, Input} from '@angular/core';
import {KeyValue} from '@angular/common';
import {Employee} from '../../../../../models/employee.model';

@Component({
  selector: 'app-tax-exemptions',
  templateUrl: './tax-exemptions.component.html',
  styleUrls: ['./tax-exemptions.component.scss']
})
export class TaxExemptionsComponent {
  @Input() public employee!: Employee;
  public props: KeyValue<keyof Employee, string>[] = [
    { key: 'stateExempt', value: 'State Exempt' },
    { key: 'fedExempt', value: 'Fed Exempt' },
    { key: 'fedSsExempt', value: 'SS Exempt' },
    { key: 'fedMcExempt', value: 'MC Exempt' },
  ];
}
