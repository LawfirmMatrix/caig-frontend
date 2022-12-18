import {Injectable} from "@angular/core";
import {filter, from, Observable, of, throwError} from "rxjs";
import {catchError, tap} from "rxjs/operators";
import {SwUpdate} from "@angular/service-worker";

@Injectable({providedIn: 'root'})
export class ServiceWorkerService {
  private static readonly NO_SW_CONTROLLER = 'NO_SW_CONTROLLER';
  constructor(private updates: SwUpdate) { }
  public initialize(): Observable<any> {
    if (!this.updates.isEnabled) {
      return of(null);
    }
    if (!navigator.serviceWorker.controller) {
      const alreadyReloaded = localStorage.getItem(ServiceWorkerService.NO_SW_CONTROLLER);
      if (!alreadyReloaded) {
        localStorage.setItem(ServiceWorkerService.NO_SW_CONTROLLER, 'true');
        location.reload();
      }
    }
    localStorage.removeItem(ServiceWorkerService.NO_SW_CONTROLLER);
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
