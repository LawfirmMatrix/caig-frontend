import {Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {concatMap, map} from 'rxjs/operators';
import {EmailActions} from '../actions/action-types';
import {EmailService} from '../../../../core/services/email.service';
import {SignatureBlockService} from '../../../../core/services/signature-block.service';

@Injectable()
export class EmailEffects {
  public loadEmailTemplates$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailActions.loadEmailTemplates),
      concatMap(() => this.emailService.getTemplates()),
      map((templates) => EmailActions.emailTemplatesLoaded({templates}))
    )
  );
  public loadEmailSignatures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailActions.loadEmailSignatures),
      concatMap(() => this.signatureService.get()),
      map((signatures) => EmailActions.emailSignaturesLoaded({signatures}))
    )
  );
  public loadFields$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EmailActions.loadFields),
      concatMap(() => this.emailService.getTemplatePlaceholders()),
      map((fields) => EmailActions.fieldsLoaded({fields}))
    )
  );
  constructor(
    private actions$: Actions,
    private emailService: EmailService,
    private signatureService: SignatureBlockService,
  ) {
  }
}
