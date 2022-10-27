import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FieldBase, InputField, CheckboxField, InputButton} from 'dynamic-form';
import {NotificationsService} from 'notifications';
import {Clipboard} from '@angular/cdk/clipboard';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {UserDataService} from '../../../modules/users/services/user-data.service';
import {generatePassword} from '../../util/functions';
import {AuthService} from '../../../auth/services/auth.service';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-change-password',
  template: `
    <div fxLayout="column" fxLayoutGap="10px">
      <div *ngIf="dialogRef.disableClose" mat-dialog-title>
        Please create a new password
      </div>
      <div>Password requirements:</div>
      <app-password-requirements [form]="form" (isValid)="validPassword$.next($event)"></app-password-requirements>
      <dynamic-form [fields]="fields" [form]="form"></dynamic-form>
      <button mat-raised-button color="primary" [disabled]="disableSave$ | async" (click)="save()">Save</button>
      <button *ngIf="dialogRef.disableClose" mat-button (click)="dialogRef.close()">
        Remind me later
      </button>
    </div>
  `,
})
export class ChangePasswordComponent implements OnInit {
  public form = new FormGroup({});
  public validPassword$ = new BehaviorSubject<boolean>(false);
  public fields!: FieldBase<any>[][];
  public disableSave$!: Observable<boolean>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ChangePasswordData,
    public dialogRef: MatDialogRef<ChangePasswordComponent>,
    private dataService: UserDataService,
    private notifications: NotificationsService,
    private clipboard: Clipboard,
    private authService: AuthService,
  ) {
  }
  public ngOnInit() {
    const invalidForm$ = this.form.statusChanges
      .pipe(
        map((status) => status !== 'VALID'),
        startWith(true)
      );
    this.disableSave$ = combineLatest([invalidForm$, this.validPassword$])
      .pipe(
        map(([invalidForm, validPassword]) => invalidForm || !validPassword)
      );
    const newPassword = new InputField({
      key: 'password',
      label: 'New Password',
      type: 'password',
      required: true,
    });
    const confirmPassword = new InputField({
      key: 'confirmPassword',
      label: 'Confirm New Password',
      type: 'password',
      required: true,
    });
    confirmPassword.buttons = [ visibilityButton(confirmPassword) ];
    newPassword.buttons = [ visibilityButton(newPassword) ];
    this.fields = [[ newPassword ], [ confirmPassword ]];
    if (this.data.self) {
      const storedPassword = this.data.copyAuthPassword ? this.authService.loggedInPassword : undefined;
      const currentPassword = new InputField({
        key: 'currentPassword',
        label: 'Current Password',
        type: 'password',
        required: true,
        value: storedPassword,
        disabled: !!storedPassword,
      });
      currentPassword.buttons = [ visibilityButton(currentPassword) ];
      this.fields.unshift([ currentPassword ]);
    } else {
      newPassword.buttons.push(
        generatePasswordButton(this.form),
        copyContentButton(this.clipboard, this.notifications),
      );
      this.fields.push([ changePasswordOnNextLogin ]);
    }
  }
  public save(): void {
    this.form.disable();
    this.dataService.patch(this.data.userId, this.form.getRawValue(), this.data.self)
      .subscribe(() => {
        this.notifications.showSimpleInfoMessage('Successfully changed password');
        this.dialogRef.close(true);
      }, () => this.form.enable());
  }
}

export const visibilityButton = (field: InputField): InputButton => {
  const button = {
    icon: 'visibility',
    callback: () => {
      field.type = field.type === 'password' ? 'text' : 'password';
      button.icon = button.icon === 'visibility' ? 'visibility_off' : 'visibility';
      button.tooltip = button.tooltip === 'Show Password' ? 'Hide Password' : 'Show Password';
    },
    tooltip: 'Show Password',
  };
  return button;
};

export const generatePasswordButton = (form: FormGroup, passwordLength = 16): InputButton => {
  return {
    icon: 'refresh',
    callback: () => {
      const password = generatePassword(passwordLength);
      form.patchValue({ password });
    },
    color: 'accent',
    tooltip: 'Generate random password',
  };
}

export const copyContentButton = (clipboard: Clipboard, notifications: NotificationsService): InputButton => {
  return {
    icon: 'content_copy',
    callback: (value: string) => {
      clipboard.copy(value);
      notifications.showSimpleInfoMessage('Copied password to clipboard');
    },
    disabled: (value: string) => !value,
    tooltip: 'Copy password to clipboard',
  };
}

export const changePasswordOnNextLogin = new CheckboxField({
  key: 'mustChangePassword',
  label: 'User must change password on next login',
  position: 'start',
  value: true,
});

export interface ChangePasswordData {
  userId: number;
  self: boolean;
  copyAuthPassword?: boolean;
}
