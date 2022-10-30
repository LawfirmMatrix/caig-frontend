import {Component, EventEmitter, Input, OnDestroy, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {NotificationsService} from 'notifications';

@Component({
  selector: 'lib-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnDestroy {
  @Input() public endpoint: string = '';
  @Output() public uploaded = new EventEmitter<File[]>();

  public isLoading = false;
  public queuedFiles: File[] = [];
  private onDestroy$ = new Subject<void>();

  constructor(
    private http: HttpClient,
    private notifications: NotificationsService,
  ) { }

  public chooseFile(files: FileList | null): void {
    if (!files || files.length === 0) {
      return;
    }
    for (let i = 0; i < files.length; i++) {
      this.queuedFiles.unshift(files[i]);
    }
  }
  public upload(): void {
    const formData = new FormData();
    this.queuedFiles.forEach((f) => formData.append('files', f));
    const onSuccess = () => {
      this.isLoading = false;
      this.uploaded.emit(this.queuedFiles);
      this.notifications.showSimpleInfoMessage(`Successfully uploaded ${this.queuedFiles.length} file${this.queuedFiles.length === 1 ? '' : 's'}`);
      this.queuedFiles = [];
    };
    const onError = (err: HttpErrorResponse) => {
      this.isLoading = false;
      this.notifications.showDetailedMessage('An error has occurred', err);
    };
    this.isLoading = true;
    this.http.post(this.endpoint, formData)
      .pipe(takeUntil(this.onDestroy$)).subscribe(onSuccess, onError);
  }
  public ngOnDestroy(): void {
    this.onDestroy$.next(void 0);
  }
}
