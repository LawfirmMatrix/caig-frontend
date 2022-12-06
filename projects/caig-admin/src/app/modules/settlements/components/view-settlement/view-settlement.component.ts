import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SettlementComponent} from '../settlement.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-view-settlement',
  templateUrl: './view-settlement.component.html',
  styleUrls: ['./view-settlement.component.scss']
})
export class ViewSettlementComponent extends SettlementComponent {
  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => matches)
  );
  constructor(
    protected override route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
  ) {
    super(route);
  }
}
