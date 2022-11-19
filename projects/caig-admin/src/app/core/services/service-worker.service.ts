import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate, VersionReadyEvent, VersionEvent} from '@angular/service-worker';
import {concat, filter, from, interval, Observable, of, throwError} from 'rxjs';
import {catchError, first, shareReplay, skip, switchMap, tap, map} from 'rxjs/operators';
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
      filter(ServiceWorkerService.isVersionReady),
      tap(ServiceWorkerService.storeAppData),
      shareReplay(1),
    );
  constructor(
    private updates: SwUpdate,
    private notifications: NotificationsService,
    private appRef: ApplicationRef,
    private dialog: MatDialog,
  ) {
    if (updates.isEnabled) {
      this.initialize();
    }
  }
  private initialize(): void {
    this.checkIfUpdated();
    this.pollForUpdates();
    this.handleUnrecoverableState();
    this.handleUpdateError();
  }
  private static isVersionReady(event: VersionEvent): event is VersionReadyEvent {
    return event.type === 'VERSION_READY';
  }
  private static storeAppData(event: VersionReadyEvent): void {
    const appData = event.latestVersion.appData as AppData | undefined;
    if (appData) {
      localStorage.setItem(ServiceWorkerService.APP_DATA_STORAGE_KEY, JSON.stringify(appData));
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
  public checkForUpdate(): Observable<any> {
    if (!this.updates.isEnabled) {
      return of(null);
    }
    const register$: Observable<ServiceWorkerRegistration | null> = navigator.serviceWorker.controller ?
      of(null) : from(navigator.serviceWorker.register('ngsw-worker.js'));
    const versionReady = (installUpdate: boolean) => this.updates.versionUpdates.pipe(
      first(),
      tap((event) => {
        if (ServiceWorkerService.isVersionReady(event)) {
          ServiceWorkerService.storeAppData(event);
        }
        if (installUpdate) {
          this.installUpdate(false);
        }
      }),
      map(() => installUpdate),
    );
    return register$.pipe(
      tap((register) => console.log('register$', register)),
      switchMap(() => from(this.updates.checkForUpdate())),
      tap((checkForUpdate) => console.log('check for update', checkForUpdate)),
      switchMap((updateFound) => updateFound ? versionReady(updateFound) : of(updateFound)),
      catchError((err) => {
        location.reload();
        return throwError(err);
      })
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
