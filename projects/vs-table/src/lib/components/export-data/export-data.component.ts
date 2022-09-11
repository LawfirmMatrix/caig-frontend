import {Component} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'vs-table-export-data',
  templateUrl: './export-data.component.html',
  styleUrls: ['./export-data.component.scss']
})
export class ExportDataComponent {
  public filename = '';
  constructor(public dialogRef: MatDialogRef<ExportDataComponent>) { }
}
