import {TableColumn, TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class NumberColumn<T> extends BaseColumn<T> {
  public sum: boolean;
  public format: string | undefined = '1.2-2';
  public dataType = TableColumnDataType.Number;
  constructor(config: TableColumn<T>) {
    super(config);
    this.sum = !!config.sum;
    this.format = config.format;
    this.fxLayoutAlign = config.fxLayoutAlign || 'end center';
  }
}
