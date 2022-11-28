import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, map} from 'rxjs/operators';
import {EmailActions} from '../actions/action-types';
import {EmailService} from '../../../../core/services/email.service';
import {tap} from 'rxjs';

@Injectable()
export class EmailEffects {
  public loadEmailTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailActions.loadEmailTemplates),
      concatMap(() => this.emailService.getTemplates()),
      map((templates) => EmailActions.emailTemplatesLoaded({templates}))
    )
  );
  public loadFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailActions.loadFields),
      tap((x) => console.log(x)),
      concatMap(() => this.emailService.getTemplatePlaceholders()),
      map((fields) => EmailActions.fieldsLoaded({fields}))
    )
  );
  constructor(
    private actions$: Actions,
    private emailService: EmailService,
  ) {
  }
}
