import {Component} from '@angular/core';
import {PayrollEntityService} from '../../services/payroll-entity.service';

@Component({
  selector: 'app-payrolls-list',
  templateUrl: './payrolls-list.component.html',
  styleUrls: ['./payrolls-list.component.scss']
})
export class PayrollsListComponent {
  public payrolls$ = this.dataService.entities$;
  constructor(private dataService: PayrollEntityService) { }
}
