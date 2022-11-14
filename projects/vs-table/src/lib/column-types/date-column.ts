import {TableColumn, TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class DateColumn<T> extends BaseColumn<T> {
  public format: string;
  public dataType = TableColumnDataType.Date;
  constructor(config: TableColumn<T>) {
    super(config);
    this.format = config.format || 'shortDate';
  }
}
