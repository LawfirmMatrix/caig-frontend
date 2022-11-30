import {Component} from '@angular/core';
import {Observable} from 'rxjs';
import {Employee} from '../../../../models/employee.model';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent {
  public employee$: Observable<Employee> = this.route.data.pipe(
    map((data) => data['employee'])
  );
  constructor(private route: ActivatedRoute) {
  }
}
