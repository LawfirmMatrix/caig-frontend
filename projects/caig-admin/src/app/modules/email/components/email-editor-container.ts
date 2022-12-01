import {user, currentSettlement} from '../../../core/store/selectors/core.selectors';
import {filter, combineLatest, Observable} from 'rxjs';
import {isNotUndefined} from '../../../core/util/functions';
import {map} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {InputField, SelectField, FieldBase} from 'dynamic-form';
import {UntypedFormGroup} from '@angular/forms';

export abstract class EmailEditorContainer {
  public form = new UntypedFormGroup({});
  public model$!: Observable<any>;
  public fields!: FieldBase<any>[][];
  constructor(protected store: Store<AppState>) {
    const user$ = this.store.select(user).pipe(filter(isNotUndefined));
    const settlement$ = this.store.select(currentSettlement).pipe(filter(isNotUndefined));
    const fromEmails$ = combineLatest([user$, settlement$]).pipe(
      map(([user, settlement]) => [settlement.adminEmail, user.email].filter((e) => !!e).map((value) => ({value}))),
    );
    this.fields = [
      [
        new InputField({
          key: 'ccAddress',
          label: 'Cc:',
          disabled: true,
        }),
        new SelectField({
          key: 'fromAddress',
          label: 'From:',
          options: fromEmails$,
          itemKey: 'value',
          displayField: 'value',
          required: true,
        }),
      ]
    ];

    this.model$ = settlement$.pipe(
      map((settlement) => ({
        fromAddress: settlement.adminEmail,
        ccAddress: settlement.adminCc
      }))
    );
  }
}
