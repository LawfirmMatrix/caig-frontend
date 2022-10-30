import {Inject, Injectable} from '@angular/core';
import {MatSnackBar, MatSnackBarConfig} from '@angular/material/snack-bar';
import {Subject} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {COOLDOWN_DURATION} from './notifications.module';
import {DetailedSnackbarComponent} from './detailed-snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private defaultAction = 'CLOSE';
  private defaultConfig: MatSnackBarConfig = {
    duration: 10000,
    horizontalPosition: 'right',
    verticalPosition: 'top',
  };
  private notification$ = new Subject<NotificationMessage>();
  constructor(@Inject(COOLDOWN_DURATION) private cdd: number, private snackBar: MatSnackBar) {
    this.notification$
      .pipe(debounceTime(cdd))
      .subscribe((msg) => this.openSnackbar(msg));
  }
  public showSimpleInfoMessage(
    message: string,
    action: string = this.defaultAction,
    config: MatSnackBarConfig = {...this.defaultConfig},
  ): void {
    this.notification$.next({message, action, config, isDetailed: false});
  }
  public showSimpleWarningMessage(
    message: string,
    action: string = this.defaultAction,
    config: MatSnackBarConfig = {...this.defaultConfig},
  ): void {
    config.panelClass = 'warning-snack';
    this.notification$.next({message, action, config, isDetailed: false});
  }
  public showSimpleErrorMessage(
    message: string,
    action: string = this.defaultAction,
    config: MatSnackBarConfig = {...this.defaultConfig},
  ): void {
    config.panelClass = 'error-snack';
    this.notification$.next({message, action, config, isDetailed: false});
  }
  public showDetailedMessage(
    message: string,
    details: any,
    config: MatSnackBarConfig = {...this.defaultConfig}
  ): void {
    config.panelClass = 'detailed-snack';
    config.data = {message, details};
    this.notification$.next({message, action: '', config, isDetailed: true});
  }
  private openSnackbar(notification: NotificationMessage): void {
    if (notification.isDetailed) {
      this.snackBar.openFromComponent(DetailedSnackbarComponent, notification.config);
    } else {
      this.snackBar.open(notification.message, notification.action, notification.config);
    }
  }
}

interface NotificationMessage {
  message: string;
  action: string;
  isDetailed: boolean;
  config: MatSnackBarConfig;
}
