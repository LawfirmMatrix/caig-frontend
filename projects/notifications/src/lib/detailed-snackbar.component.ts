import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {DetailedSnackbarDialogComponent} from './detailed-snackbar-dialog.component';

@Component({
  selector: 'lib-detailed-snackbar',
  template: `
    <div fxLayout="row" fxLayoutAlign="space-between center">
      <div fxFlex class="detailed-snack-error-message">{{ data.message }}</div>
      <button mat-button (click)="showDetails()">Details</button>
      <button mat-icon-button (click)="snackRef.dismiss()">
        <mat-icon aria-label="Close">close</mat-icon>
      </button>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class DetailedSnackbarComponent {
  constructor(
    public snackRef: MatSnackBarRef<DetailedSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string, details: any },
    private dialog: MatDialog,
  ) {
  }
  public showDetails(): void {
    this.snackRef.dismiss();
    this.dialog.open(DetailedSnackbarDialogComponent, {
      data: this.data,
      width: '600px',
      position: {
        top: 'top',
        right: 'right',
      },
      panelClass: 'error-details-dialog',
    });
  }
}
