import {Component, Input} from '@angular/core';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-toolbar-buttons',
  templateUrl: './toolbar-buttons.component.html',
  styleUrls: ['./toolbar-buttons.component.scss'],
})
export class ToolbarButtonsComponent {
  @Input() public buttons!: ToolbarButton[];
  @Input() public align: string = 'start center';
}

export interface ToolbarButton {
  label: string;
  callback?: () => void;
  routerLink?: string;
  icon?: string;
  color?: ThemePalette;
  disabled?: boolean;
}
