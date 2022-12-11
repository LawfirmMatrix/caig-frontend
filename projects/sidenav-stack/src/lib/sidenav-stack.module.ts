import {NgModule, Optional, SkipSelf, ModuleWithProviders} from '@angular/core';
import { SidenavStackComponent } from './component/sidenav-stack.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavStackService} from './sidenav-stack.service';
import {MatButtonModule} from '@angular/material/button';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    SidenavStackComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class SidenavStackModule {
  constructor(@Optional() @SkipSelf() parentModule?: SidenavStackModule) {
    // Do not allow multiple injections
    if (parentModule) {
      throw new Error('SidenavStackModule has already been loaded. Import this module in the AppModule only.');
    }
  }

  static forRoot(): ModuleWithProviders<SidenavStackModule> {
    return {
      ngModule: SidenavStackModule,
      providers: [SidenavStackService],
    }
  }
}
