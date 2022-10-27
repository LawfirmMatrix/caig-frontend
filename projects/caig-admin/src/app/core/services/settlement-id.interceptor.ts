import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {first, switchMap} from 'rxjs/operators';
import {AuthService} from '../../auth/services/auth.service';
import {settlementId} from '../store/selectors/core.selectors';
import {AppState} from '../../store/reducers';

@Injectable()
export class SettlementIdInterceptor implements HttpInterceptor {
  constructor(private store: Store<AppState>) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.store.select(settlementId)
      .pipe(
        first(),
        switchMap((storedSettlementId) => {
          const settlementId = storedSettlementId || AuthService.settlementId;
          const queryParamName = 'settlementId';
          if (settlementId) {
            const cloned = req.params.has(queryParamName) ? req : req.clone({
              params: req.params.set(queryParamName, settlementId),
            });
            return next.handle(cloned);
          }
          return next.handle(req);
        })
      );
  }
}
