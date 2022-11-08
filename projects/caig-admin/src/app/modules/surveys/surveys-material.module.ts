import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  exports: [
    MatToolbarModule,
    MatProgressBarModule,
  ]
})
export class SurveysMaterialModule { }
