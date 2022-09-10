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
import {NumberFilterComponent} from './components/column-filter/number-filter/number-filter.component';
import {DateFilterComponent} from './components/column-filter/date-filter/date-filter.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule} from '@angular/material-moment-adapter';
import {MAT_DATE_LOCALE, MatRippleModule} from '@angular/material/core';
import {DefaultFilterComponent} from './components/column-filter/default-filter/default-filter.component';
import {IconFilterComponent} from './components/column-filter/icon-filter/icon-filter.component';
import {MatGridListModule} from '@angular/material/grid-list';
import {ChangesFilterComponent} from './components/column-filter/changes-filter/changes-filter.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@NgModule({
  declarations: [
    VsTableComponent,
    NumberFilterComponent,
    DateFilterComponent,
    DefaultFilterComponent,
    IconFilterComponent,
    ChangesFilterComponent,
    AccountingPipe,
    CalculatePipe,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
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
    MatDatepickerModule,
    MatMomentDateModule,
    MatGridListModule,
    MatRippleModule,
    MatSlideToggleModule,
  ],
  exports: [
    VsTableComponent
  ],
  providers: [
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: {useUtc: true}},
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
  ]
})
export class VsTableModule { }
