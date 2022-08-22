import { NgModule } from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {VsTableComponent} from './components/vs-table/vs-table.component';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {CommonModule} from '@angular/common';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {AccountingPipe} from './pipes/accounting.pipe';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';



@NgModule({
  declarations: [
    VsTableComponent,
    AccountingPipe,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [
    VsTableComponent
  ]
})
export class VsTableModule { }
