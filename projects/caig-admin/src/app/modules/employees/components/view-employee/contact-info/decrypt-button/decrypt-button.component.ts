import {Component, Input, OnChanges, SimpleChanges, Output, EventEmitter} from '@angular/core';
import {Employee} from '../../../../../../models/employee.model';
import {EmployeeEntityService} from '../../../../services/employee-entity.service';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {FormDialogComponent, FormDialogData} from '../../../../../../core/components/form-dialog/form-dialog.component';
import {Observable, tap, filter} from 'rxjs';
import {ChangePasswordComponent} from '../../../../../../core/components/change-password/change-password.component';
import {SsnField} from 'dynamic-form';
import {switchMap} from 'rxjs/operators';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';

@Component({
  selector: 'app-decrypt-button',
  templateUrl: './decrypt-button.component.html',
  styleUrls: ['./decrypt-button.component.scss'],
  exportAs: 'decrypt',
})
export class DecryptButtonComponent implements OnChanges {
  private static readonly ENCRYPTED = '[Encrypted]';
  @Input() public employee!: Employee;
  @Input() public prop!: keyof Employee;
  @Output() public valueSet = new EventEmitter<void>();
  public isProcessing = false;
  public employeeValue = '';
  public decryptedValue = '';
  constructor(
    private dataService: EmployeeEntityService,
    private notifications: NotificationsService,
    private dialog: MatDialog,
  ) { }
  public ngOnChanges(changes: SimpleChanges) {
    if (this.employee && this.prop) {
      this.employeeValue = this.employee[this.prop] as string || '';
    }
  }
  public encrypt(): void {
    this.decryptedValue = '';
    this.employeeValue = DecryptButtonComponent.ENCRYPTED;
  }
  public decrypt(): void {
    this.isProcessing = true;
    this.dataService.decrypt(this.employee.id, this.prop)
      .subscribe((res) => {
        this.decryptedValue = res[this.prop];
        this.isProcessing = false;
      }, () => this.isProcessing = false);
  }
  public edit(): void {
    const employeeValue = this.employeeValue;
    const decryptedValue = this.decryptedValue;
    this.collectResponse()?.pipe(
      filter((data) => !!data),
      tap((data) => {
        this.isProcessing = true;
        if (!employeeValue) {
          this.valueSet.emit(void 0);
        }
        this.employeeValue = DecryptButtonComponent.ENCRYPTED;
        this.decryptedValue = data[this.prop];
      }),
      switchMap((data) => this.dataService.patch({id: this.employee.id, [this.prop]: data[this.prop]}))
    )
      .subscribe(() => {
        this.isProcessing = false;
        this.notifications.showSimpleInfoMessage(`Successfully updated employee's ${this.prop}`);
      }, () => {
        this.employeeValue = employeeValue;
        this.decryptedValue = decryptedValue;
        this.isProcessing = false;
      });
  }
  public remove(): void {
    const employeeValue = this.employeeValue;
    const decryptedValue = this.decryptedValue;
    const data: ConfirmDialogData = { title: 'Confirm Delete', text: `Are you sure you want to delete ${this.employee.name}'s ${this.prop}?` };
    this.dialog.open(ConfirmDialogComponent, { data })
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        tap(() => {
          this.employeeValue = '';
          this.decryptedValue = '';
        }),
        switchMap(() => this.dataService.patch({id: this.employee.id, [this.prop]: null})),
      )
      .subscribe(() => {
        this.isProcessing = false;
        this.notifications.showSimpleInfoMessage(`Successfully removed employee's ${this.prop}`);
      }, () => {
        this.employeeValue = employeeValue;
        this.decryptedValue = decryptedValue;
        this.isProcessing = false;
      });
  }
  private collectResponse(): Observable<any> | null {
    switch (this.prop) {
      case 'ssn':
        const data: FormDialogData = {
          title: 'Edit Employee SSN',
          confirmText: 'Save',
          fields: [
            [
              new SsnField({
                key: 'ssn',
                label: 'SSN',
                required: true,
              })
            ]
          ],
        };
        return this.dialog.open(FormDialogComponent, { data }).afterClosed();
      case 'password':
        return this.dialog.open(ChangePasswordComponent).afterClosed()
      default:
        return null;
    }
  }
}
