import {TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class ChangesColumn<T> extends BaseColumn<T> {
  public dataType = TableColumnDataType.Changes;
}
