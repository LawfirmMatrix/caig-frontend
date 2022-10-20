import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs';
import {shareReplay} from 'rxjs/operators';

export abstract class HandsetComponent {
  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(({ matches }) => matches),
      shareReplay(1)
    );

  constructor(protected breakpointObserver: BreakpointObserver) { }
}
