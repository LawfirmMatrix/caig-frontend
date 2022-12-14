import {Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {TreeNode, TreeNodeMenuConfig} from '../../interfaces';

@Component({
  selector: 'tree-viewer-node',
  templateUrl: './tree-viewer-node.component.html',
  styleUrls: ['../../styles/styles.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeViewerNodeComponent<T extends TreeNode<T>> implements OnInit {
  @Input() public node!: T;
  @Input() public isExpanded!: boolean;
  @Input() public nodeMenuConfig: TreeNodeMenuConfig<T> | undefined;
  @Input() public showDiff!: boolean;
  @Input() public hideTotal!: boolean;
  @Input() public nodeIndex!: number;
  @Input() public level: number = 0;

  @Output() public nodeExpanded = new EventEmitter<boolean>();

  public levels!: any[];

  public ngOnInit() {
    this.levels = new Array(this.level);
  }

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
    this.nodeExpanded.emit(this.isExpanded);
  }
}
