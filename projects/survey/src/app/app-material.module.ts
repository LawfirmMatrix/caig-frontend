import {NgModule} from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  exports: [
    MatToolbarModule,
    MatProgressSpinnerModule,
  ]
})
export class AppMaterialModule { }
