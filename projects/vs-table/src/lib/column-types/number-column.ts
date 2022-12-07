import {TableColumn, TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class NumberColumn<T> extends BaseColumn<T> {
  public sum: boolean;
  public format: string;
  public dataType = TableColumnDataType.Number;
  public negateValue: boolean;
  constructor(config: TableColumn<T>) {
    super(config);
    this.sum = !!config.sum;
    this.format = config.format || '1.2-2';
    this.fxLayoutAlign = config.fxLayoutAlign || 'end center';
    this.negateValue = !!config.negateValue;
  }
}
