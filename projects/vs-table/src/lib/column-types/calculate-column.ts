import {ICalculateColumn, TableColumnDataType} from '../utils/interfaces';
import {BaseColumn} from './base-column';

export class CalculateColumn<T> extends BaseColumn<T> {
  public calculate: (row: T) => string;
  public dataType = TableColumnDataType.Calculate;
  constructor(config: ICalculateColumn<T>) {
    super(config);
    this.calculate = config.calculate;
  }
}
