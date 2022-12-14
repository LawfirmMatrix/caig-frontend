import {Pipe, PipeTransform} from '@angular/core';
import {TreeNodeMenuItem, TreeNode} from '../interfaces';

@Pipe({name: 'visibleMenu'})
export class VisibleMenuPipe<T extends TreeNode<any>> implements PipeTransform {
  transform(menu: TreeNodeMenuItem<T>[], node: T): TreeNodeMenuItem<T>[] {
    return menu.filter((button) => !button.hide || !button.hide(node));
  }
}
