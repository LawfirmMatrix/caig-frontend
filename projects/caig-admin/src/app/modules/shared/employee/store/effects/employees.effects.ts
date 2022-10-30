import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {EmployeesActions} from '../actions/action-types';
import {concatMap, map} from 'rxjs/operators';
import {EmailService} from '../../../../../core/services/email.service';

@Injectable()
export class EmployeesEffects {
  public loadEmailTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadEmailTemplates),
      concatMap(() => this.emailService.getTemplates()),
      map((templates) => EmployeesActions.emailTemplatesLoaded({templates}))
    )
  );
  public loadFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmployeesActions.loadFields),
      concatMap(() => this.emailService.getTemplatePlaceholders()),
      map((fields) => EmployeesActions.fieldsLoaded({fields}))
    )
  );
  constructor(
    private actions$: Actions,
    private emailService: EmailService,
  ) {
  }
}
