import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatStepperModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
  ],
})
export class PayrollsMaterialModule { }
