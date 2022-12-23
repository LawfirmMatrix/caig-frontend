import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {TreeData, TreeNode, TreeNodeMenuConfig, NodeExpandToggle} from '../../interfaces';
import {SelectionModel} from '@angular/cdk/collections';

@Component({
  selector: 'vs-tree-viewer',
  templateUrl: './vs-tree-viewer.component.html',
  styleUrls: ['./vs-tree-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VsTreeViewerComponent<T extends TreeNode<T>> implements OnChanges {
  @Input() public data: TreeData<T> | null = null;
  @Input() public headerLabel: string = '';
  @Input() public footerLabel: string = '';
  @Input() public totalLabel: string = 'Total';
  @Input() public hideFooter: boolean = false;
  @Input() public hideTotal: boolean = false;
  @Input() public showDiff: boolean = false;
  @Input() public nodeMenuConfig: TreeNodeMenuConfig<T> | undefined; // @TODO
  @Input() public isExpanded = true;

  @Output() public nodeToggle = new EventEmitter<NodeExpandToggle<T>>();

  public expansionModel = new SelectionModel<T>(true, []);
  public nodes: T[] | undefined;
  public minWidth: number = 0;

  public ngOnChanges(changes: SimpleChanges) {
    const isExpanded = changes['isExpanded'];
    const data = changes['data'];
    const hideTotal = changes['hideTotal'];
    if (data || hideTotal) {
      const cellWidth = 150;
      this.minWidth = 250 +
        (this.data?.dimensions ? this.data.dimensions.length * cellWidth : 0) +
        (this.hideTotal ? 0 : cellWidth);
    }
    if (data || isExpanded) {
      this.createNodes();
    }
  }

  public toggleExpand(node: T, index: number): void {
    this.expansionModel.toggle(node);
    const isExpanded = this.expansionModel.isSelected(node);
    this.nodeToggle.emit({ node, isExpanded });
    if (isExpanded) {
      this.insertChildren(node, index);
    } else {
      this.filterChildren(node);
    }
  }

  public toggleExpandAll(): void {
    this.isExpanded = !this.isExpanded;
    this.createNodes();
  }

  private filterChildren(node: T): void {
    const notChildren = this.nodes?.filter((n) => n.parent !== node);
    const children = this.nodes?.filter((n) => n.parent === node);
    this.nodes = notChildren;
    children?.filter((n) => n.parent === node).forEach((child) => {
      this.expansionModel.deselect(child);
      this.filterChildren(child);
    });
  }

  private insertChildren(node: T, index: number): void {
    const children = this.data?.nodes.filter((n) => n.parent === node);
    if (this.nodes && children) {
      const nodes: T[] = this.nodes;
      nodes.splice(index + 1, 0, ...children);
      this.nodes = [...nodes];
    }
  }

  private createNodes(): void {
    if (this.data) {
      if (this.isExpanded) {
        this.expansionModel.setSelection(...this.data.nodes);
        this.nodes = this.data.nodes;
      } else {
        this.expansionModel.clear();
        this.nodes = this.data.nodes.filter((n) => n.depth === 0);
      }
    }
  }
}
