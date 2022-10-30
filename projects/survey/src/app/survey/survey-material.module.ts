import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatCardModule} from '@angular/material/card';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatStepperModule} from '@angular/material/stepper';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  exports: [
    MatToolbarModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatStepperModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SurveyMaterialModule { }
