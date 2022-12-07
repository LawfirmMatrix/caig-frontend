import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {isArray} from 'lodash-es';
import {NotificationsService} from 'notifications';

export abstract class EntityDataService<T extends { id: string | number }> {
  protected abstract baseUrl: string;
  protected abstract entityName: { single: string, plural: string };
  constructor(
    protected http: HttpClient,
    protected notifications: NotificationsService,
  ) { }
  public get(params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, { params });
  }
  public getOne(id: string | number, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`, { params });
  }
  public save(payload: Partial<T>, params?: HttpParams): Observable<T> {
    const request$ = payload.id ?
      this.http.put<T>(`${this.baseUrl}/${payload.id}`, payload, { params }) :
      this.http.post<T>(this.baseUrl, payload, { params });
    return request$.pipe(tap(() =>
      this.notifications.showSimpleInfoMessage(`Successfully ${payload.id ? 'updated' : 'created'} ${this.entityName.single}`)));
  }
  public patch(id: string | number, payload: Partial<T>, params?: HttpParams): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, payload, { params }).pipe(tap(() =>
      this.notifications.showSimpleInfoMessage(`Successfully updated ${this.entityName.single}`)
    ));
  }
  public remove(ids: string | number | string[] | number[], params?: HttpParams): Observable<void> {
    const isMany = isArray(ids);
    const isPlural = isMany && ids.length > 1;
    const request$ = isMany ?
      this.http.post<void>(`${this.baseUrl}/bulkdelete`, { ids }, { params }) :
      this.http.delete<void>(`${this.baseUrl}/${ids}`, { params });
    return request$.pipe(tap(() =>
      this.notifications.showSimpleInfoMessage(`Successfully deleted ${isMany ? `${ids.length} ` : ''}${isPlural ? this.entityName.plural : this.entityName.single}`)
    ));
  }
}
