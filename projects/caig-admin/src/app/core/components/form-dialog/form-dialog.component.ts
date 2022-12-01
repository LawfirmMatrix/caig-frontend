import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FieldBase} from 'dynamic-form';

@Component({
  selector: 'app-form-dialog',
  template: `
    <div mat-dialog-title>{{data.title}}</div>
    <mat-dialog-content>
      <dynamic-form #df [fields]="data.fields"></dynamic-form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-button [disabled]="df.form.invalid" [mat-dialog-close]="df.form.value" cdkFocusInitial>{{data.confirmText}}</button>
    </mat-dialog-actions>


  `,
})
export class FormDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: FormDialogData) { }
}

export interface FormDialogData {
  title: string;
  confirmText: string;
  fields: FieldBase<any>[][];
}
