import {NgModule} from '@angular/core';
import {MatDialogModule} from '@angular/material/dialog';
import {CommonModule} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
  ],
  declarations: [
    ConfirmDialogComponent,
  ],
})
export class CoreModule { }
