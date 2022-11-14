import {Injectable} from '@angular/core';
import {TableColumn, IconColumn, TextColumn, DateColumn} from 'vs-table';
import {RespondentFlat} from './respondents-list';

@Injectable()
export class ColumnConfigService {
  private _sharedColumns: TableColumn<RespondentFlat>[] = [
    new IconColumn({
      title: 'Linked',
      field: 'proposedMatches',
      calculate: (row) => row.employeeView ? 'link' : 'link_off',
      badge: { value: (row) => row.proposedMatches?.length },
      tooltip: (row) => row.proposedMatches?.length ? `${row.proposedMatches.length} proposed match${row.proposedMatches.length === 1 ? '' : 'es'}` : '',
      color: (row) => row.employeeView ? 'green' : 'red',
    }),
    new IconColumn({
      title: 'Notes',
      field: '_notes',
      calculate: notesIcon,
      tooltip: (row) => row.notes || '',
    }),
    new IconColumn({
      title: 'Attachments',
      field: 'attachedFiles',
      calculate: (row: any) => row.attachedFiles.length ? 'file_present' : '',
      badge: { value: (row: any) => row.attachedFiles.length || null },
    }),
    new TextColumn({
      title: 'Name',
      field: 'name',
    }),
  ];
  private _notesColumns: TableColumn<RespondentFlat>[] = [
    new TextColumn({
      title: 'Note',
      field: 'notes',
    }),
    new DateColumn({
      title: 'Submitted',
      field: 'whenSubmitted',
      format: 'short',
    }),
  ];
  public get notesColumns(): TableColumn<RespondentFlat>[] {
    return [...this._notesColumns];
  }
  public get sharedColumns(): TableColumn<RespondentFlat>[] {
    return [...this._sharedColumns];
  }
}

function notesIcon(row: RespondentFlat): string {
  return !row.notes ? '' : 'sticky_note_2';
}
