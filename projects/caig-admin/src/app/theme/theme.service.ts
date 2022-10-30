import {Injectable} from '@angular/core';
import {Theme} from './theme.types';
import {themes} from './data';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {Observable, ReplaySubject} from 'rxjs';
import {StyleManagerService} from './style-manager.service';

@Injectable({providedIn: 'root'})
export class ThemeService {
  public static storageKey = 'theme-storage-current-name';
  private _themes: Theme[] = themes;
  private _currentTheme = new ReplaySubject<Theme>();
  constructor(
    private styleManager: StyleManagerService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer
  ) {
    const safeSvg = sanitizer.bypassSecurityTrustResourceUrl('assets/theme/theme-demo-icon.svg');
    iconRegistry.addSvgIcon('theme-example', safeSvg);

    const themeName = this.getStoredThemeName();
    if (themeName) {
      this.selectTheme(themeName)
    } else {
      this._themes.find((theme) => {
        if (theme.isDefault) {
          this.selectTheme(theme.name);
        }
      })
    }
  }

  public get themes(): Theme[] {
    return this._themes;
  }

  public get currentTheme$(): Observable<Theme> {
    return this._currentTheme.asObservable();
  }

  public selectTheme(themeName: string): void {
    const theme = this._themes.find((theme) => theme.name === themeName);

    if (!theme) {
      return;
    }

    this._currentTheme.next(theme);

    if (theme.isDefault) {
      this.styleManager.removeStyle('theme');
    } else {
      this.styleManager.setStyle('theme', `${theme.name}.css`);
    }

    this.storeTheme(theme);
  }

  private storeTheme(theme: Theme): void {
    try {
      window.localStorage[ThemeService.storageKey] = theme.name;
    } catch { }
  }

  private getStoredThemeName(): string | null {
    try {
      return window.localStorage[ThemeService.storageKey] || null;
    } catch {
      return null;
    }
  }

  private clearStorage() {
    try {
      window.localStorage.removeItem(ThemeService.storageKey);
    } catch { }
  }
}
