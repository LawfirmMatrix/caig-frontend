import {NgModule} from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  exports: [ MatProgressSpinnerModule, MatButtonModule ]
})
export class AppMaterialModule { }
