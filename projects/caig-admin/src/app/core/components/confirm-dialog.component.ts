import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title *ngIf="data.title">{{data.title}}</h1>
    <div mat-dialog-content>
      <h3 *ngIf="data.subtitle">{{data.subtitle}}</h3>
      <p>{{data.text}}</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button mat-dialog-close *ngIf="!data.hideCancel">{{data.cancelText || 'Cancel'}}</button>
      <button mat-button (click)="dialogRef.close(true)" cdkFocusInitial>{{data.confirmText || 'OK'}}</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData,
    public dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) {
  }
}

export interface ConfirmDialogData {
  text: string;
  title?: string;
  subtitle?: string;
  confirmText?: string;
  cancelText?: string;
  hideCancel?: boolean;
}
