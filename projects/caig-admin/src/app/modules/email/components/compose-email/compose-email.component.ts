import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {SelectField} from 'dynamic-form';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {Employee} from '../../../../models/employee.model';
import {EmailEditorContainer} from '../email-editor-container';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent extends EmailEditorContainer implements OnInit {
  public employee$: Observable<Employee> = this.route.data.pipe(
    map((data) => data['employee'])
  );
  constructor(
    private route: ActivatedRoute,
    protected override store: Store<AppState>,
  ) {
    super(store);
  }
  public ngOnInit() {
    const employeeEmails$: Observable<string[]> = this.employee$.pipe(
      map((employee) => [employee.email, employee.emailAlt].filter((e) => !!e))
    );
    const toAddress = this.route.snapshot.queryParams['toEmail'];

    this.fields[0].unshift(new SelectField({
      key: 'toAddress',
      label: 'To:',
      options: employeeEmails$.pipe(
        map((emailAddresses) => emailAddresses.map((value) => ({value}))),
      ),
      itemKey: 'value',
      displayField: 'value',
      required: true,
    }));

    this.model$ = this.model$.pipe(map((model) => ({
      ...model,
      toAddress,
    })));
  }
}

