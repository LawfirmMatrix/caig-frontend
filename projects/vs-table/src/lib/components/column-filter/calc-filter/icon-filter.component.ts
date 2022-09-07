import {Component} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'vs-table-icon-filter',
  templateUrl: './icon-filter.component.html',
  styleUrls: ['./icon-filter.component.scss']
})
export class IconFilterComponent {
  public readonly rowHeight = 64;
  public readonly columns = 4;
  public uniqueColumnValues: string[] = ['search', 'home', 'menu', 'close', 'settings', 'expand_more', 'done', 'check_circle', 'favorite', 'add', 'delete', 'arrow_back', 'star', 'chevron_right', 'logout', 'arrow_forward_ios', 'add_circle', 'cancel', 'arrow_back_ios', 'file_download', 'arrow_forward', 'arrow_drop_down', 'more_vert', 'check'];
  public selection = new SelectionModel<string>(true, []);
  public get viewportHeight(): number {
    return this.rowHeight * Math.ceil(this.uniqueColumnValues.length / this.columns) + 5;
  }
}
