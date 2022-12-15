import { NgModule } from '@angular/core';
import {SafePipe} from './safe.pipe';
import {AccountingPipe} from './accounting.pipe';

@NgModule({
  declarations: [
    SafePipe,
    AccountingPipe,
  ],
  exports: [
    SafePipe,
    AccountingPipe,
  ]
})
export class PipesModule { }
