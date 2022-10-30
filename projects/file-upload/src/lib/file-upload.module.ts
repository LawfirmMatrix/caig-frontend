import { NgModule } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {DropZoneDirective} from './drop-zone/drop-zone.directive';
import {FileUploadComponent} from './file-upload/file-upload.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';
import {FileSizePipe} from './pipe/file-size.pipe';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    FileUploadComponent,
    DropZoneDirective,
    FileSizePipe,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressBarModule,
  ],
  exports: [
    FileUploadComponent,
    DropZoneDirective,
  ]
})
export class FileUploadModule { }
