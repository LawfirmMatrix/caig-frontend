import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Employee} from '../../../../models/employee.model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent {
  public employee$: Observable<Employee> = this.route.data.pipe(
    map((data) => data['employee'])
  );
  constructor(private route: ActivatedRoute) {
  }
}

