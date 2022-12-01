import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './store/reducers';
import {ThemeService} from './theme/theme.service';
import {map} from 'rxjs/operators';
import {AuthService} from './auth/services/auth.service';
import {AuthActions} from './auth/store/actions/action-types';
import {LoadingService} from './core/services/loading.service';
import {
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Router,
  RouteConfigLoadStart, ActivationStart, ResolveStart
} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isDarkTheme$ = this.theme.currentTheme$.pipe(map((theme) => theme.isDark));
  constructor(
    private store: Store<AppState>,
    private theme: ThemeService,
    private router: Router,
    private loadingService: LoadingService,
  ) { }
  public ngOnInit() {
    this.loginWithStoredToken();
    this.loadOnRouterNavigation();
  }
  private loginWithStoredToken(): void {
    const token = AuthService.token;
    if (token) {
      this.store.dispatch(AuthActions.login({token}));
    }
  }
  private loadOnRouterNavigation(): void {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof RouteConfigLoadStart:
        case event instanceof ActivationStart:
        case event instanceof ResolveStart:
          this.loadingService.attach();
          break;
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError:
          this.loadingService.detach();
          break;
      }
    });
  }
}
