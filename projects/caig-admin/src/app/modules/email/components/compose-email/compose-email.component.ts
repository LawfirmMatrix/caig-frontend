import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, filter, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, SelectField, InputField} from 'dynamic-form';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {user, currentSettlement} from '../../../../core/store/selectors/core.selectors';
import {isNotUndefined} from '../../../../core/util/functions';
import {Employee} from '../../../../models/employee.model';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit {
  public form = new UntypedFormGroup({});
  public fields!: FieldBase<any>[][];
  public model$!: Observable<any>;
  public employee$: Observable<Employee> = this.route.data.pipe(
    map((data) => data['employee'])
  );
  constructor(
    private route: ActivatedRoute,
    private store: Store<AppState>,
  ) {
  }
  public ngOnInit() {
    const employeeEmails$: Observable<string[]> = this.employee$.pipe(
      map((employee) => [employee.email, employee.emailAlt].filter((e) => !!e))
    );
    const user$ = this.store.select(user).pipe(filter(isNotUndefined));
    const settlement$ = this.store.select(currentSettlement).pipe(filter(isNotUndefined));
    const fromEmails$ = combineLatest([user$, settlement$]).pipe(
      map(([user, settlement]) => [settlement.adminEmail, user.email].filter((e) => !!e).map((value) => ({value}))),
    );
    const toEmail = this.route.snapshot.queryParams['toEmail'];

    this.fields = [
      [
        new SelectField({
          key: 'fromAddress',
          label: 'From:',
          options: fromEmails$,
          itemKey: 'value',
          displayField: 'value',
          required: true,
        }),
        new SelectField({
          key: 'toAddress',
          label: 'To:',
          options: employeeEmails$.pipe(
            map((emailAddresses) => emailAddresses.map((value) => ({value}))),
          ),
          itemKey: 'value',
          displayField: 'value',
          required: true,
        }),
        new InputField({
          key: 'ccAddress',
          label: 'Cc:',
          disabled: true,
        })
      ]
    ];

    this.model$ = settlement$.pipe(
      map((settlement) => ({
        toAddress: toEmail,
        fromAddress: settlement.adminEmail,
        ccAddress: settlement.adminCc
      }))
    );
  }
}

