import {Component} from '@angular/core';
import {TableColumn} from 'vs-table';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase} from 'dynamic-form';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-payments-and-taxes',
  templateUrl: './payments-and-taxes.component.html',
  styleUrls: ['./payments-and-taxes.component.scss']
})
export class PaymentsAndTaxesComponent {
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [];
  public tabs: PaymentsAndTaxesTab[] = [
    {
      label: 'State Tax by Employee',
      id: 'state-tax-report',
      columns: [],
    },
    {
      label: 'State Tax by Date',
      id: '',
      columns: [],
    },
    {
      label: '1099 & W-2',
      id: '',
      columns: [],
    },
    {
      label: 'Payment Summary',
      id: '',
      columns: [],
    },
    {
      label: 'Payment Sequence',
      id: '',
      columns: [],
    },
    {
      label: 'Payment by Employee',
      id: '',
      columns: [],
    },
  ];
  public data$!: Observable<TaxDetail[]>;
  constructor(private router: Router) {
  }
  public viewEmployee(employeeId: number): void {
    this.router.navigate(['/employees', employeeId, 'view']);
  }
}

export interface PaymentsAndTaxesTab {
  label: string;
  id: string;
  columns: TableColumn<TaxDetail>[];
}
