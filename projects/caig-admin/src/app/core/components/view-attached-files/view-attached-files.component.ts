import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {filter, switchMap} from 'rxjs/operators';
import {ConfirmDialogComponent} from 'shared-components';
import {RowMenuItem, TableColumn, TableMenuItem, TextColumn} from 'vs-table';
import {concatName} from '../../util/functions';
import {EmployeeEntityService} from '../../../modules/employees/services/employee-entity.service';

@Component({
  selector: 'app-view-attached-files',
  templateUrl: './view-attached-files.component.html',
  styleUrls: ['./view-attached-files.component.scss']
})
export class ViewAttachedFilesComponent {
  public columns: TableColumn<AttachedFile>[] = [
    new TextColumn({
      title: 'File Name',
      field: 'name',
    }),
    new TextColumn({
      title: 'Content Type',
      field: 'contentType',
    }),
  ];
  public rowMenuItems: RowMenuItem<AttachedFile>[] = [
    {
      name: () => 'Download',
      callback: (row) => this.download(row),
    },
    {
      name: () => 'Delete',
      callback: (row) => this.remove([row]),
    }
  ];
  public tableMenuItems: TableMenuItem<AttachedFile>[] = [
    {
      name: () => 'Download Selection',
      callback: (rows) => this.bulkDownload(rows),
    },
    {
      name: () => 'Delete Selection',
      callback: (rows) => this.remove(rows),
    }
  ];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { id: string, firstName: string, middleName?: string, lastName: string, attachedFiles: AttachedFile[], whenSubmitted?: string },
    private dialogRef: MatDialogRef<ViewAttachedFilesComponent>,
    private dialog: MatDialog,
    private http: HttpClient,
    private employeesDataService: EmployeeEntityService,
  ) {
  }

  private download(file: AttachedFile): void {
    this.http.get(`/api/attachedFile/${file.id}`, { responseType: 'blob' })
      .subscribe((blob) => ViewAttachedFilesComponent.openFile(blob, file.name));
  }

  private remove(files: AttachedFile[]): void {
    const ids = files.map((f) => f.id);
    const request$ = files.length > 1 ?
      this.http.post(`/api/attachedFile/bulkDelete`, ids) :
      this.http.delete(`/api/attachedFile/${files[0].id}`);
    const title = 'Confirm Delete';
    const text = `Are you sure you want to delete ${files.length > 1 ? `all ${files.length} files` : files[0].name}?`;
    this.dialog.open(ConfirmDialogComponent, {data: {text, title}})
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(() => request$),
      )
      .subscribe(() => {
        if (!this.data.whenSubmitted) {
          this.employeesDataService.getByKey(this.data.id);
        }
      });
  }

  private bulkDownload(files: AttachedFile[]): void {
    this.http.post('/api/attachedFile/bulk', files.map((f) => f.id), { responseType: 'blob' })
      .subscribe((blob) => ViewAttachedFilesComponent.openFile(blob, concatName(this.data)));
  }

  public static openFile(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url
    a.download = filename || '';
    document.body.append(a);
    a.dispatchEvent(new MouseEvent('click'));
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

export interface AttachedFile {
  contentType: string;
  id: string;
  name: string;
}
