import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppDataChanges} from '../../../models/app-data.model';

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.scss']
})
export class WhatsNewComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AppDataChanges,
    public dialogRef: MatDialogRef<WhatsNewComponent>,
  ) { }
}
