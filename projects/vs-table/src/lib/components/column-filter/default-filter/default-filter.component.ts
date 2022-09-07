import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {SelectionModel} from '@angular/cdk/collections';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';

@Component({
  selector: 'vs-table-default-filter',
  templateUrl: './default-filter.component.html',
  styleUrls: ['./default-filter.component.scss']
})
export class DefaultFilterComponent implements OnChanges {
  @Input() public menuOpen = false;
  @ViewChild(CdkVirtualScrollViewport) public viewport!: CdkVirtualScrollViewport;
  public readonly rowHeight = 30;
  public currentIndex = 0;
  public uniqueColumnValues: string[] = new Array(1000).fill('Item').map((v, i) => v + i);
  public selection = new SelectionModel<string>(true, []);
  constructor() {
    this.uniqueColumnValues[0] = 'This is what a very long value looks like';
  }
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['menuOpen'].currentValue) {
      this.viewport.scrollToIndex(this.currentIndex, 'smooth');
    }
  }
}
