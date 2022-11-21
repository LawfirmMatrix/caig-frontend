import {ApplicationRef, Injectable} from '@angular/core';
import {SwUpdate, VersionReadyEvent, VersionEvent} from '@angular/service-worker';
import {concat, filter, from, interval, Observable, of, throwError} from 'rxjs';
import {catchError, first, shareReplay, skip, switchMap, tap, map} from 'rxjs/operators';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';
import {AppData, AppDataChanges, AppDataChangePortal} from '../../models/app-data.model';
import {WhatsNewComponent} from '../components/whats-new/whats-new.component';
import {some} from 'lodash-es';
import {Portal} from '../../models/session.model';

@Injectable({providedIn: 'root'})
export class ServiceWorkerService {
  private static readonly NOTIFY_STORAGE_KEY = 'SW_UPDATE';
  private static readonly APP_DATA_STORAGE_KEY = 'SW_UPDATE_APP_DATA';
  private static readonly NO_SW_CONTROLLER = 'NO_SW_CONTROLLER';
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
      if (!navigator.serviceWorker.controller) {
        const alreadyReloaded = localStorage.getItem(ServiceWorkerService.NO_SW_CONTROLLER);
        if (!alreadyReloaded) {
          localStorage.setItem(ServiceWorkerService.NO_SW_CONTROLLER, 'true');
          location.reload();
        }
      }
      localStorage.removeItem(ServiceWorkerService.NO_SW_CONTROLLER);
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
  public checkForUpdate(): Observable<boolean | null> {
    if (!this.updates.isEnabled) {
      return of(null);
    }
    return from(this.updates.checkForUpdate()).pipe(
      switchMap((updateFound) => {
        if (updateFound) {
          return this.updates.versionUpdates.pipe(
            first(),
            tap((event) => {
              if (ServiceWorkerService.isVersionReady(event)) {
                ServiceWorkerService.storeAppData(event);
              }
              if (updateFound) {
                this.installUpdate(false);
              }
            }),
            map(() => updateFound),
          );
        }
        return of(updateFound);
      }),
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
        if (appData.changes) {
          const changes = appData.changes;
          const portals = Object.keys(appData.changes) as Portal[];
          if (portals.length && some(portals, (p) => changes[p] && Object.keys(changes[p] as AppDataChangePortal).length > 0)) {
            this.dialog.open(WhatsNewComponent, {data: appData.changes});
          }
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
