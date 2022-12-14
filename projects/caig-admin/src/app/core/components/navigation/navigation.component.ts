import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subject} from 'rxjs';
import {debounceTime, map, shareReplay} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {RouterOutlet} from '@angular/router';
import {isAdmin, portal, selectCoreState} from '../../store/selectors/core.selectors';
import {CoreActions} from '../../store/actions/action-types';
import {fader} from './animations';
import {NavMenuService} from './nav-menu.service';
import {ServiceWorkerService} from '../../services/service-worker.service';
import {CoreState} from '../../store/reducers';
import {Portal} from '../../../models/session.model';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  animations: [fader],
})
export class NavigationComponent implements OnInit {
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  public userMenu$: Observable<NavMenuItem[]> = this.store.select(portal)
    .pipe(map((portal) => this.navService.build(portal)));
  public adminMenu$ = this.store.select(portal).pipe(
    map((portal) => {
      const users = {
        name: 'Users',
        icon : 'people',
        route : '/users'
      };
      return portal === Portal.CAIG ?
        [
          {
            name: 'Settlements',
            icon: 'gavel',
            route: 'settlements',
          },
          {
            name: 'Payrolls',
            icon: 'payments',
            route: 'payrolls',
          },
          users,
          {
            name: 'Configurations',
            icon: 'settings',
            route: 'configurations',
          },
        ] :
        [ users ];
    })
  );
  public isAdmin$ = this.store.select(isAdmin);
  public coreState$: Observable<CoreState> = this.store.select(selectCoreState);
  public changeSettlement$ = new Subject<number>();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private navService: NavMenuService,
    public swService: ServiceWorkerService,
  ) { }
  public ngOnInit() {
    this.changeSettlement$
      .pipe(debounceTime(200))
      .subscribe((settlementId) => this.store.dispatch(CoreActions.settlementChange({settlementId})));
  }
  public prepareRoute(outlet: RouterOutlet): string {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}

export interface NavMenuItem {
  name: string;
  icon: string;
  route: string;
}
