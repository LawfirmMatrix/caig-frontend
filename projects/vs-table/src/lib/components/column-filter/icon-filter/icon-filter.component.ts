import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {uniq} from 'lodash-es';
import {TableColumn} from '../../../utils/interfaces';
import {IconColumn} from '../../../column-types/icon-column';

@Component({
  selector: 'vs-table-icon-filter',
  templateUrl: './icon-filter.component.html',
  styleUrls: ['./icon-filter.component.scss']
})
export class IconFilterComponent<T> implements OnChanges {
  @Input() public data: T[] | null = null;
  @Input() public column!: TableColumn<T>;
  public readonly rowHeight = 64;
  public readonly columns = 4;
  public uniqueColumnValues: string[] = [];
  public selection = new SelectionModel<string>(true, []);
  public get viewportHeight(): number {
    return this.rowHeight * Math.ceil(this.uniqueColumnValues.length / this.columns) + 5;
  }
  public ngOnChanges(changes: SimpleChanges) {
    const data: T[] | undefined = changes['data']?.currentValue;
    if (data) {
      this.uniqueColumnValues = uniq(data
        .filter((row) => row[this.column.field] !== null && row[this.column.field] !== undefined)
        .map((this.column as IconColumn<T>).calculate)
      );
    }
  }
}
