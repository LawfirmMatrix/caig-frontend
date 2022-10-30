import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'lib-detailed-snackbar-dialog',
  template: `
    <button mat-icon-button (click)="dialogRef.close()" style="float: right">
      <mat-icon aria-label="Close">close</mat-icon>
    </button>
    <h2 mat-dialog-title>Details</h2>
    <mat-dialog-content class="mat-typography" style="height: 500px;">
      <h3>{{data.message}}</h3>
      <pre>{{parsedDetails}}</pre>
    </mat-dialog-content>
  `,
  encapsulation: ViewEncapsulation.None
})
export class DetailedSnackbarDialogComponent implements OnInit {
  public parsedDetails!: string;
  constructor(
    public dialogRef: MatDialogRef<DetailedSnackbarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {message: string, details: any},
  ) {
  }
  public ngOnInit() {
    this.parsedDetails = JSON.stringify(this.data.details, null, 2);
  }
}
