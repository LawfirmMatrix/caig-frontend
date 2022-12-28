import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {Employee} from '../../../../../models/employee.model';
import {Observable, filter, ReplaySubject, combineLatest} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/reducers';
import {settlementId} from '../../../../../core/store/selectors/core.selectors';
import {isNotUndefined} from '../../../../../core/util/functions';
import {map} from 'rxjs/operators';
import {CoreActions} from '../../../../../core/store/actions/action-types';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent implements OnInit, OnChanges {
  @Input() public employee!: Employee;
  public isNotCurrentSettlement$!: Observable<boolean>;
  private employeeSettlementId$ = new ReplaySubject<number>();
  constructor(private store: Store<AppState>) { }
  public ngOnInit() {
    const settlementId$ = this.store.select(settlementId).pipe(filter(isNotUndefined));
    this.isNotCurrentSettlement$ = combineLatest([settlementId$, this.employeeSettlementId$])
      .pipe(map(([settlementId, employeeSettlementId]) => settlementId !== employeeSettlementId));
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (this.employee) {
      this.employeeSettlementId$.next(this.employee.settlementId);
    }
  }
  public changeSettlement(settlementId: number): void {
    this.store.dispatch(CoreActions.settlementChange({settlementId}));
  }
}
