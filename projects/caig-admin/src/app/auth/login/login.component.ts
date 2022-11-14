import {Component, HostListener} from '@angular/core';
import {FormControl, UntypedFormGroup, Validators} from '@angular/forms';
import {AuthService} from '../services/auth.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/reducers';
import {ThemeService} from '../../theme/theme.service';
import {map} from 'rxjs/operators';
import {AuthActions} from '../store/actions/action-types';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @HostListener('window:keydown', ['$event'])
  public handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && this.signInForm.valid && this.signInForm.enabled) {
      this.login();
    }
  }
  public signInForm = new UntypedFormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  public showErrorMessage = false;
  public themeBackground$ = this.themeService.currentTheme$
    .pipe(
      map((theme) => `url("assets/backgrounds/login-${theme.isDark ? 'dark.jpg' : 'light.png'})`),
    );

  constructor(
    private authService: AuthService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    public themeService: ThemeService,
  ) {
  }

  public login() {
    if (this.signInForm.invalid) {
      return;
    }
    this.showErrorMessage = false;
    this.signInForm.disable();
    const password = this.signInForm.value.password || '';
    this.authService.login(this.signInForm.value.username || '', password)
      .subscribe((token) => {
        this.store.dispatch(AuthActions.login({token}));
        const redirectURL = this.route.snapshot.queryParamMap.get('redirect') || '/';
        this.router.navigateByUrl(redirectURL);
      }, () => {
        this.showErrorMessage = true;
        this.signInForm.enable();
      });
  }
}

