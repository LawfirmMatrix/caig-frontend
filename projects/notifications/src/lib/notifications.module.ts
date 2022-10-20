import {InjectionToken, ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DetailedSnackbarComponent} from './detailed-snackbar.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DetailedSnackbarDialogComponent} from './detailed-snackbar-dialog.component';
import {MatDialogModule} from '@angular/material/dialog';

export const COOLDOWN_DURATION = new InjectionToken<number>('COOLDOWN_DURATION');

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
  declarations: [
    DetailedSnackbarComponent,
    DetailedSnackbarDialogComponent,
  ],
})
export class NotificationsModule {
  constructor(@Optional() @SkipSelf() parentModule?: NotificationsModule) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error('NotificationsModule has already been loaded. Import this module in the AppModule only.');
    }
  }

  static forRoot(cooldown: number = 200): ModuleWithProviders<NotificationsModule> {
    return {
      ngModule: NotificationsModule,
      providers: [
        {
          provide: COOLDOWN_DURATION,
          useValue: cooldown,
        }
      ],
    }
  }
}
