import {TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class TextColumn<T> extends BaseColumn<T> {
  public dataType = TableColumnDataType.Text;
}
