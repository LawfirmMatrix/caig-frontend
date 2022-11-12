import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from './store/reducers';
import {Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError} from '@angular/router';
import {ThemeService} from './theme/theme.service';
import {map} from 'rxjs/operators';
import {AuthService} from './auth/services/auth.service';
import {AuthActions} from './auth/store/actions/action-types';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public isLoading = true;
  public isDarkTheme$ = this.theme.currentTheme$.pipe(map((theme) => theme.isDark));
  constructor(
    private store: Store<AppState>,
    private router: Router,
    private theme: ThemeService,
  ) { }
  public ngOnInit() {
    console.log(environment.production);
    this.applyCachedToken();
    this.listenToLoadingEvents();
  }
  private applyCachedToken(): void {
    const token = AuthService.token;
    if (token) {
      this.store.dispatch(AuthActions.login({token}));
    }
  }
  private listenToLoadingEvents(): void {
    this.router.events.subscribe((event) => {
      switch (true) {
        case event instanceof NavigationStart: {
          this.isLoading = true;
          break;
        }
        case event instanceof NavigationEnd:
        case event instanceof NavigationCancel:
        case event instanceof NavigationError: {
          this.isLoading = false;
          break;
        }
        default: {
          break;
        }
      }
    });
  }
}
