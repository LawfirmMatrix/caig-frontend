import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {Employee} from '../../../../models/employee.model';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-batch-email',
  templateUrl: './batch-email.component.html',
  styleUrls: ['./batch-email.component.scss']
})
export class BatchEmailComponent implements OnInit {
  public employees$: Observable<Employee[]> = this.route.data.pipe(
    map((data) => data['employees']),
  );
  constructor(private route: ActivatedRoute) { }
  public ngOnInit() {
    this.employees$.subscribe(console.log);
  }
}
