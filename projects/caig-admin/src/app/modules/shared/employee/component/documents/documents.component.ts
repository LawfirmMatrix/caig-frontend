import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {TableColumn, RowMenuItem, TableMenuItem, TextColumn} from 'vs-table';
import {HttpClient} from '@angular/common/http';
import {filter, switchMap} from 'rxjs/operators';
import {MatDialog} from '@angular/material/dialog';
import {differenceBy} from 'lodash-es';
import {Employee} from '../../../../../models/employee.model';
import {
  AttachedFile,
  ViewAttachedFilesComponent
} from '../../../../../core/components/view-attached-files/view-attached-files.component';
import {ConfirmDialogComponent} from 'shared-components';
import {EmployeeEntityService} from '../../../../employees/services/employee-entity.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss']
})
export class DocumentsComponent implements OnChanges {
  @Input() public employee!: Employee;
  public files: AttachedFile[] | null = null;
  public selectedIndex: number | undefined;
  public columns: TableColumn<AttachedFile>[] = [
    new TextColumn({
      title: 'File Name',
      field: 'name',
    }),
    new TextColumn({
      title: 'Content Type',
      field: 'contentType',
    })
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
    private http: HttpClient,
    private dialog: MatDialog,
    private employeeService: EmployeeEntityService,
  ) {
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['employee']?.currentValue) {
      setTimeout(() => {
        this.files = this.employee.attachedFiles?.length ? this.employee.attachedFiles : null;
        this.selectedIndex = this.files ? 0 : 1;
      }, 1000);
    }
  }
  public filesUploaded(files: File[]): void {
    this.employeeService.getByKey(this.employee.id);
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
      .pipe(filter((res) => !!res), switchMap(() => request$))
      .subscribe(() => {
        if (this.files) {
          this.files = differenceBy(this.files, files, 'id');
          this.employeeService.updateOneInCache({...this.employee, attachedFiles: this.files});
        }
      });
  }
  private bulkDownload(files: AttachedFile[]): void {
    this.http.post('/api/attachedFile/bulk', files.map((f) => f.id), { responseType: 'blob' })
      .subscribe((blob) => ViewAttachedFilesComponent.openFile(blob, this.employee.name));
  }
}

