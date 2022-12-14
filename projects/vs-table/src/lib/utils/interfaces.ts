import {ThemePalette} from '@angular/material/core';
import {Sort} from '@angular/material/sort';

export interface BadgeConfig<T> {
  value: (row: T) => string | number | undefined | null;
  color?: ThemePalette;
}

export enum TableColumnDataType {
  Text = 'Text',
  Date = 'Date',
  Currency = 'Currency',
  Calculate = 'Calculate',
  Icon = 'Icon',
  Number = 'Number',
  Changes = 'Changes',
}

export interface RowMenuItem<T> {
  name: (row: T) => string;
  callback: (row: T, index: number) => void;
  hide?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
}

export interface TableMenuItem<T> {
  name: (rows: T[]) => string;
  callback: (rows: T[]) => void;
  hide?: (rows: T[]) => boolean;
  disabled?: (rows: T[]) => boolean;
}

export type ColumnAlign = 'start center' | 'center center' | 'end center';

export interface ExportConfig {
  filename: string;
  options?: any;
}

export interface RowClick<T> {
  row: T;
  index: number;
}

export interface SelectionChange<T> {
  added: T[];
  removed: T[];
  selection: T[];
  isAllSelected: boolean;
}

export interface TableCache<T> {
  columns?: CachedTableColumn<T>[];
  filter?: string;
  scrollOffset?: number;
  sort?: Sort;
}

export interface CachedTableColumn<T> {
  field: Extract<keyof T, string>;
  hide: boolean;
}

export interface TableColumn<T> {
  field: Extract<keyof T, string>;
  title: string;
  dataType?: TableColumnDataType;
  hide?: boolean;
  fxLayoutAlign?: ColumnAlign;
  color?: (row: T) => string;
  backgroundColor?: (row: T) => string;
  tooltip?: (row: T) => string;
  badge?: BadgeConfig<T>;
  calculate?: (row: T) => string;
  sum?: boolean;
  format?: string;
  fxFlex?: number;
  negateValue?: boolean;
  extraField?: Extract<keyof T, string>;
}

export interface ICalculateColumn<T> extends TableColumn<T> {
  calculate: (row: T) => string;
}

export interface ButtonColumn<T> {
  position: 'start' | 'end';
  title: string;
  label: (row: T) => string | number;
  callback: (row: T, index: number) => void;
  color?: (row: T) => ThemePalette;
  disabled?: (row: T) => boolean;
}

export interface ExpandRowConfig<T> {
  title: string;
  callback: (newRow: any, row: T) => void;
  newRows: (row: T) => any[];
  newRowKey: string;
  newRowBadge?: NewRowBadge;
  expandBadge?: (row: T) => string | number | undefined;
  hide?: (row: T) => boolean;
}

export type NewRowBadge = (newRow: any) => string | number | undefined;
