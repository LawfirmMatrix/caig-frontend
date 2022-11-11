import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Respondent} from '../../../../models/respondent.model';
import {RespondentDataService} from '../../services/respondent-data.service';

@Component({
  selector: 'app-edit-notes',
  templateUrl: './edit-notes.component.html',
  styleUrls: ['./edit-notes.component.scss']
})
export class EditNotesComponent {
  public isProcessing = false;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Respondent,
    public dialogRef: MatDialogRef<EditNotesComponent>,
    private dataService: RespondentDataService,
  ) {
  }
  public save(notes: string): void {
    this.isProcessing = true;
    this.dataService.patch(this.data.id, {notes})
      .subscribe(() => this.dialogRef.close(notes), () => this.isProcessing = false);
  }
}
