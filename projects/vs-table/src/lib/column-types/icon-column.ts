import {ICalculateColumn, TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class IconColumn<T> extends BaseColumn<T> {
  public calculate: (row: T) => string;
  public dataType = TableColumnDataType.Icon;
  constructor(config: ICalculateColumn<T>) {
    super(config);
    this.calculate = config.calculate;
    this.fxLayoutAlign = config.fxLayoutAlign || 'center center';
  }
}
