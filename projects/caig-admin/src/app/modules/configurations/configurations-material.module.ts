import {NgModule} from '@angular/core';
import {MatListModule} from '@angular/material/list';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  exports: [
    MatListModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
  ]
})
export class ConfigurationsMaterialModule { }
