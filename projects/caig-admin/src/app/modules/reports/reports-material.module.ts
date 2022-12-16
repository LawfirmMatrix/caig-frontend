import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';

@NgModule({
  exports: [
    MatToolbarModule,
    MatListModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
  ]
})
export class ReportsMaterialModule { }
