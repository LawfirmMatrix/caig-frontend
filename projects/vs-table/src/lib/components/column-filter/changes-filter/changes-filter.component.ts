import {Component} from '@angular/core';
import {DefaultFilterComponent} from '../default-filter/default-filter.component';
import {uniq, flatten} from 'lodash-es';

@Component({
  selector: 'vs-table-changes-filter',
  templateUrl: '../default-filter/default-filter.component.html',
  styleUrls: ['../default-filter/default-filter.component.scss']
})
export class ChangesFilterComponent extends DefaultFilterComponent<any> {
  protected override calculateUniqueColumnValues(): void {
    if (!this.data) {
      return;
    }
    const data = this.filterOptions ? this.filteredData : this.data;
    this.uniqueColumnValues = uniq(flatten(data
      .filter((row) => row[this.column.field] !== null && row[this.column.field] !== undefined)
      .map((row) => row.changes.map((change: any) => change.field))
    ));
  }
}
