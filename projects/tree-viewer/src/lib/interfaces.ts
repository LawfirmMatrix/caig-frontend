export interface TreeData<T extends TreeNode<T>> {
  nodes: T[];
  dimensions?: {header: string, total?: number, type?: 'number', format?: string}[];
  total?: number;
}

export interface TreeNode<T extends TreeNode<T>> {
  name: string;
  value: any;
  dimensions?: {value: any, type?: 'number' | 'currency' | 'date', format?: string}[];
  diff?: any;
  nodes?: T[];
}

export interface NodeExpandToggle<T extends TreeNode<T>> {
  node: T;
  isExpanded: boolean;
}

export interface TreeNodeMenuConfig<T extends TreeNode<T>> {
  requireField?: keyof T;
  menu: TreeNodeMenuItem<T>[];
}

export interface TreeNodeMenuItem<T extends TreeNode<T>> {
  name: string;
  callback: (node: T) => void;
  hide?: (node: T) => boolean;
}
