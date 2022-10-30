import {Component, OnInit} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {Observable, Subject} from 'rxjs';
import {debounceTime, map, shareReplay} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {OfflineStatusService} from '../../services/offline-status.service';
import {RouterOutlet} from '@angular/router';
import {isAdmin, portal, settlementId, settlements} from '../../store/selectors/core.selectors';
import {CoreActions} from '../../store/actions/action-types';
import {fader} from './animations';
import {NavMenuService} from './nav-menu.service';
import {ServiceWorkerService} from '../../services/service-worker.service';

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
  public adminMenu = [
    {
      name: 'Users',
      icon : 'people',
      route : '/users'
    },
  ];
  public isAdmin$ = this.store.select(isAdmin);
  public settlements$ = this.store.select(settlements);
  public settlementId$ = this.store.select(settlementId);
  public changeSettlement$ = new Subject<number>();
  constructor(
    private breakpointObserver: BreakpointObserver,
    private store: Store<AppState>,
    private navService: NavMenuService,
    public offlineService: OfflineStatusService,
    public swService: ServiceWorkerService
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
