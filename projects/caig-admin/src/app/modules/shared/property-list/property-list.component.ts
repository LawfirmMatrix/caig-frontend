import {Component, Input, ChangeDetectionStrategy} from '@angular/core';
import {rowColor, rowIcon} from '../../surveys/components/respondents-list/respondents-list';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PropertyListComponent<T> {
  @Input() public object!: T;
  @Input() public items!: ListItem<T>[];

  public currency(value: any): number {
    return Number(value);
  }
  public date(value: any): string {
    return String(value);
  }
}

export class ListItem<T> {
  public type: ListItemType;
  public fxFlex: number | undefined;
  public fxLayoutAlign: string;
  public iconValue: ((value: T) => string) | undefined;
  public iconColor: ((value: T) => string) | undefined;
  constructor(
    public label: string,
    public field: Extract<keyof T, string>,
    type?: ListItemType,
  ) {
    const isIcon = type === 'icon';
    const isHTML = type === 'html';
    this.fxLayoutAlign = isIcon ? 'center center' : 'start center';
    this.iconColor = isIcon ? rowColor<T>(field) : undefined;
    this.iconValue = isIcon ? rowIcon<T>(field) : undefined;
    this.fxFlex = isHTML ? 0 : 50;
    this.type = type || 'default';
  }
}

type ListItemType = 'html' | 'icon' | 'date' | 'currency' | 'link' | 'default';
