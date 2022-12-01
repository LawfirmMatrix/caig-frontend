import {NgModule} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatMenuModule} from '@angular/material/menu';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  exports: [
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatChipsModule,
    ScrollingModule,
  ],
})
export class EmailMaterialModule { }
