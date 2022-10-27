import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-attach-files',
  template: `
    <div fxLayout="column">
      <div fxLayoutAlign="end center">
        <button mat-mini-fab color="warn" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <lib-file-upload endpoint="/api/attachedFile/for{{data.whenSubmitted ? 'Respondent' : 'Employee'}}/{{data.id}}" (uploaded)="dialogRef.close($event)"></lib-file-upload>
    </div>
  `,
  styles: [`
    button {
      position: absolute;
      margin-top: -108px;
      margin-right: -20px;
    }
    lib-file-upload {
      min-height: 300px;
      width: 400px;
    }
  `]
})
export class AttachFilesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string, whenSubmitted?: string },
    public dialogRef: MatDialogRef<AttachFilesComponent>,
  ) {
    this.dialogRef.disableClose = true;
  }
}
