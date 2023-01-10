import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Employee} from '../../../../models/employee.model';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent {
  public employee$: Observable<Employee | undefined> = this.route.data.pipe(
    map((data) => data['employee']),
  );
  constructor(private route: ActivatedRoute) { }
}
