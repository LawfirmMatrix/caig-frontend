import {NgModule, Optional, SkipSelf, ModuleWithProviders, ViewContainerRef, forwardRef} from '@angular/core';
import { SidenavStackComponent } from './component/sidenav-stack.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SidenavStackService} from './sidenav-stack.service';

@NgModule({
  declarations: [
    SidenavStackComponent
  ],
  imports: [
    FlexLayoutModule,
    MatSidenavModule,
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
