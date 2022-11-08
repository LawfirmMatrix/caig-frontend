import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSortModule} from '@angular/material/sort';
import {MatIconModule} from '@angular/material/icon';
import {MatMenuModule} from '@angular/material/menu';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatCardModule} from '@angular/material/card';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  exports: [
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    DragDropModule,
    MatCardModule,
    MatSlideToggleModule,
  ],
})
export class UsersMaterialModule { }
