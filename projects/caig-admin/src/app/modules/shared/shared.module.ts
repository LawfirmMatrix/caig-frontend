import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FlexLayoutModule} from '@angular/flex-layout';
import {LocationPipe} from './pipe/location.pipe';
import {ZeroPadPipe} from './pipe/zero-pad.pipe';
import {SafePipe} from './pipe/safe.pipe';
import {StartCasePipe} from './pipe/start-case.pipe';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
  ],
  declarations: [
    LocationPipe,
    ZeroPadPipe,
    SafePipe,
    StartCasePipe,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    LocationPipe,
    ZeroPadPipe,
    SafePipe,
    StartCasePipe,
  ],
})
export class SharedModule { }
