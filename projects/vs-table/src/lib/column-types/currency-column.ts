import {TableColumn, TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class CurrencyColumn<T> extends BaseColumn<T> {
  public sum: boolean;
  public format: string | undefined;
  public dataType = TableColumnDataType.Currency;
  public negateValue: boolean;
  public extraField: Extract<keyof T, string> | undefined;
  constructor(config: TableColumn<T>) {
    super(config);
    this.sum = !!config.sum;
    this.format = config.format;
    this.fxLayoutAlign = config.fxLayoutAlign || 'end center';
    this.negateValue = !!config.negateValue;
    this.extraField = config.extraField;
  }
}
