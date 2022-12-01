import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-email-preview',
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EmailPreviewData) { }
}

export interface EmailPreviewData {
  toAddress: string[];
  fromAddress: string;
  subjectRendered: string;
  bodyRendered: string;
  ccAddress?: string;
  eventCode?: number;
  eventMessage?: string;
}
