import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LocationPipe} from './pipe/location.pipe';
import {ZeroPadPipe} from './pipe/zero-pad.pipe';
import {StartCasePipe} from './pipe/start-case.pipe';
import {PipesModule} from 'pipes';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    PipesModule,
  ],
  declarations: [
    LocationPipe,
    ZeroPadPipe,
    StartCasePipe,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    PipesModule,
    LocationPipe,
    ZeroPadPipe,
    StartCasePipe,
  ],
})
export class SharedModule { }
