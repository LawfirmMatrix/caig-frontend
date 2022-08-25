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
import {DragDropModule} from '@angular/cdk/drag-drop';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSortModule} from '@angular/material/sort';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {CalculatePipe} from './pipes/calculate.pipe';
import {OverlayModule} from '@angular/cdk/overlay';

@NgModule({
  declarations: [
    VsTableComponent,
    AccountingPipe,
    CalculatePipe,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ScrollingModule,
    DragDropModule,
    OverlayModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatBadgeModule,
    MatSortModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  exports: [
    VsTableComponent
  ]
})
export class VsTableModule { }
