import {Injectable, ElementRef} from '@angular/core';
import {TableCache} from '../utils/interfaces';

@Injectable({providedIn: 'root'})
export class TableCacheService<T> {
  private static cacheKey(table: ElementRef): string | undefined {
    return table.nativeElement.id ? `vs-table-${table.nativeElement.id}` : undefined;
  }
  private readonly tables: ElementRef[] = [];

  constructor() {
    window.onbeforeunload = () => {
      const fields: (keyof TableCache<T>)[] = ['scrollOffset', 'sort'];
      this.tables.forEach((table) => this.clearCache(table, fields))
    };
  }

  public register(table: ElementRef): void {
    if (!this.isRegistered(table)) {
      this.tables.push(table);
    }
  }

  public getCache(table: ElementRef): TableCache<T> | undefined {
    const cacheKey = TableCacheService.cacheKey(table);
    if (cacheKey) {
      const cache = localStorage.getItem(cacheKey);
      if (cache) {
        return JSON.parse(cache);
      }
    }
    return undefined;
  }

  public canCache(table: ElementRef): boolean {
    return !!TableCacheService.cacheKey(table);
  }

  public saveCache(table: ElementRef, payload: TableCache<T>): void {
    const cacheKey = TableCacheService.cacheKey(table);
    if (cacheKey) {
      localStorage.setItem(cacheKey, JSON.stringify(payload));
    }
  }

  public clearCache(table: ElementRef, fields?: (keyof TableCache<T>)[]): void {
    const cache = this.getCache(table);
    if (cache) {
      const cacheKey = TableCacheService.cacheKey(table) as string;
      if (fields) {
        fields.forEach((field) => delete cache[field]);
        localStorage.setItem(cacheKey, JSON.stringify(cache));
      } else {
        const index = this.tables.indexOf(table);
        localStorage.removeItem(cacheKey);
        this.tables.splice(index, 1);
      }
    }
  }

  private isRegistered(table: ElementRef): boolean {
    const key = TableCacheService.cacheKey(table);
    const keys = this.tables.map(TableCacheService.cacheKey);
    return keys.includes(key);
  }
}
