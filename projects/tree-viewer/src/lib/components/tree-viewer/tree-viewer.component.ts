import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {TreeNodeMenuConfig, NodeExpandToggle, TreeData, TreeNode} from '../../interfaces';

@Component({
  selector: 'tree-viewer',
  templateUrl: './tree-viewer.component.html',
  styleUrls: ['../../styles/styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerComponent<T extends TreeNode<T>> {
  @Input() public data: TreeData<T> | null = null;
  @Input() public headerLabel: string = '';
  @Input() public footerLabel: string = '';
  @Input() public totalLabel: string = 'Total';
  @Input() public hideTotal: boolean = false;
  @Input() public hideFooter: boolean = false;
  @Input() public showDiff: boolean = false;
  @Input() public nodeMenuConfig: TreeNodeMenuConfig<T> | undefined;
  @Input() public isExpanded = true;

  @Output() public nodeToggle = new EventEmitter<NodeExpandToggle<T>>();
}
