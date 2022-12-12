import {NgModule} from '@angular/core';
import {PropertyListComponent} from './property-list.component';
import {MatListModule} from '@angular/material/list';
import {SharedModule} from '../shared.module';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [
    SharedModule,
    MatListModule,
    MatIconModule,
  ],
  declarations: [ PropertyListComponent ],
  exports: [ PropertyListComponent ],
})
export class PropertyListModule { }
