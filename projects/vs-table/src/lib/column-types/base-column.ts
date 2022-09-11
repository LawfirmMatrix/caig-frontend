import {BadgeConfig, ColumnAlign, TableColumn, TableColumnDataType} from '../utils/interfaces';

export abstract class BaseColumn<T> {
  public field: Extract<keyof T, string>;
  public title: string;
  public hide: boolean;
  public fxLayoutAlign: ColumnAlign;
  public color: ((row: T) => string) | undefined;
  public tooltip: ((row: T) => string) | undefined;
  public badge: BadgeConfig<T> | undefined;
  public fxFlex: number;

  public abstract dataType: TableColumnDataType;

  constructor(config: TableColumn<T>) {
    this.field = config.field;
    this.title = config.title;
    this.hide = !!config.hide;
    this.fxLayoutAlign = config.fxLayoutAlign || 'start center';
    this.color = config.color;
    this.tooltip = config.tooltip;
    this.badge = config.badge;
    this.fxFlex = config.fxFlex || 0;
  }
}
