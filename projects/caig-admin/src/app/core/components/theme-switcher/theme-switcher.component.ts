import {Component, ViewEncapsulation} from '@angular/core';
import {ThemeService} from '../../../theme/theme.service';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.component.html',
  styleUrls: ['./theme-switcher.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ThemeSwitcherComponent {
  constructor(public themeService: ThemeService) { }
}
