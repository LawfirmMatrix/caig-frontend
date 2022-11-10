import {Injectable} from "@angular/core";
import {filter, from, Observable, of, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {SwUpdate} from "@angular/service-worker";

@Injectable({providedIn: 'root'})
export class ServiceWorkerService {
  constructor(private updates: SwUpdate) { }
  public initialize(): Observable<any> {
    if (!this.updates.isEnabled) {
      return of(null);
    }
    return from(this.updates.checkForUpdate())
      .pipe(
        tap((updateFound) => {
          if (updateFound) {
            this.updates.activateUpdate().finally(() => location.reload());
          }
        }),
        filter((installUpdate) => !installUpdate),
        catchError((err) => {
          location.reload();
          return throwError(err);
        }),
      );
  }
}
