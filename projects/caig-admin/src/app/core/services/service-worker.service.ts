import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate, VersionReadyEvent} from '@angular/service-worker';
import {concat, filter, from, interval, Observable, of, throwError, delay} from 'rxjs';
import {catchError, first, shareReplay, skip, switchMap, tap, withLatestFrom, map} from 'rxjs/operators';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';
import {AppData} from '../../models/app-data.model';
import {WhatsNewComponent} from '../components/whats-new/whats-new.component';

@Injectable({providedIn: 'root'})
export class ServiceWorkerService {
  private static readonly NOTIFY_STORAGE_KEY = 'SW_UPDATE';
  private static readonly APP_DATA_STORAGE_KEY = 'SW_UPDATE_APP_DATA';
  public isUpdating = false;
  public isUpdateAvailable$ = this.updates.versionUpdates
    .pipe(
      filter((event): event is VersionReadyEvent => event.type === 'VERSION_READY'),
      tap((event) => {
        console.log(event);
        const appData = event.latestVersion.appData as AppData | undefined;
        if (appData) {
          localStorage.setItem(ServiceWorkerService.APP_DATA_STORAGE_KEY, JSON.stringify(appData));
        }
      }),
      shareReplay(1),
    );
  constructor(
    private updates: SwUpdate,
    private notifications: NotificationsService,
    private appRef: ApplicationRef,
    private dialog: MatDialog,
  ) {
    if (updates.isEnabled) {
      if (!navigator.serviceWorker.controller) {
        // controller is stuck with null value if browser is hard refreshed
        // service worker needs to be re-registered
        navigator.serviceWorker.register('ngsw-worker.js');
      }
      this.checkIfUpdated();
      this.pollForUpdates();
      this.handleUnrecoverableState();
      this.handleUpdateError();
    }
  }
  public installUpdate(notify = true): void {
    if (this.updates.isEnabled) {
      this.isUpdating = true;
      this.updates.activateUpdate().finally(() => {
        this.isUpdating = false;
        if (notify) {
          localStorage.setItem(ServiceWorkerService.NOTIFY_STORAGE_KEY, 'true');
        }
        location.reload();
      });
    }
  }
  public initialize(): Observable<any> {
    if (!this.updates.isEnabled) {
      return of(null);
    }
    return from(this.updates.checkForUpdate())
      .pipe(
        switchMap((updateFound) =>
          this.updates.versionUpdates.pipe(
            first(),
            tap((x) => console.log(x)),
            map(() => updateFound)
          )
        ),
        tap((updateFound) => {
          console.log(updateFound);
          if (updateFound) {
            this.installUpdate(false);
          }
        }),
        filter((installUpdate) => !installUpdate),
        catchError((err) => {
          location.reload();
          return throwError(err);
        }),
      );
  }
  private pollForUpdates(): void {
    const appIsStable$ = this.appRef.isStable.pipe(first((isStable) => isStable));
    const everyHalfHour$ = interval(30 * 60 * 1000);
    const everyHalfHourOnceAppIsStable$ = concat(appIsStable$, everyHalfHour$);
    everyHalfHourOnceAppIsStable$
      .pipe(skip(1))
      .subscribe(() => this.updates.checkForUpdate());
  }
  private checkIfUpdated(): void {
    const notify = localStorage.getItem(ServiceWorkerService.NOTIFY_STORAGE_KEY);
    const cachedData = localStorage.getItem(ServiceWorkerService.APP_DATA_STORAGE_KEY);
    if (notify) {
      localStorage.removeItem(ServiceWorkerService.NOTIFY_STORAGE_KEY);
      this.notifications.showSimpleInfoMessage('The update has been installed successfully!');
    }
    if (cachedData) {
      localStorage.removeItem(ServiceWorkerService.APP_DATA_STORAGE_KEY);
      const appData: AppData = JSON.parse(cachedData);
      if (appData) {
        if (appData.clearLocalStorage) {
          localStorage.clear();
        }
        if (appData.changes && Object.keys(appData.changes).length) {
          this.dialog.open(WhatsNewComponent, {data: appData.changes});
        }
      }
    }
  }
  private handleUnrecoverableState(): void {
    this.updates.unrecoverable
      .pipe(
        switchMap((event) => {
          const data: ConfirmDialogData = {
            title: 'Something went wrong...',
            subtitle: 'An error occurred that we cannot recover from:',
            text: event.reason,
            confirmText: 'Reload Page',
            hideCancel: true,
          };
          return this.dialog.open(ConfirmDialogComponent, {data, disableClose: true}).afterClosed();
        })
      )
      .subscribe(() => location.reload());
  }
  private handleUpdateError(): void {
    this.updates.versionUpdates
      .pipe(filter((event) => event.type === 'VERSION_INSTALLATION_FAILED'))
      .subscribe((event) => {
        console.log('An error occurred while updating', event);
        location.reload();
      });
  }
}
