import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Employee, EmployeeStatusFlat} from '../../../../../models/employee.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/reducers';
import {employeeStatusesFlat} from '../../../../../enums/store/selectors/enums.selectors';
import {ReplaySubject} from 'rxjs';
import {filter, takeUntil} from 'rxjs/operators';
import {isNotUndefined} from '../../../../../core/util/functions';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit, OnDestroy {
  @Input() public employee!: Employee;
  public statuses: string[] = [];
  private onDestroy$ = new ReplaySubject<void>();
  constructor(private store: Store<AppState>) { }
  public ngOnInit() {
    this.store.select(employeeStatusesFlat)
      .pipe(
        filter(isNotUndefined),
        takeUntil(this.onDestroy$)
      )
      .subscribe((res) => {
        const status = res.find((s) => s.name === this.employee.status);
        if (status) {
          const reverseStatusTree = (status: EmployeeStatusFlat) => {
            this.statuses.unshift(status.name);
            if (status.parentStatus) {
              reverseStatusTree(status.parentStatus);
            }
          };
          reverseStatusTree(status);
        }
      });
  }
  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }
}
