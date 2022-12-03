import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {isArray} from 'lodash-es';

export abstract class EntityDataService<T extends { id: string | number }> {
  protected abstract baseUrl: string;
  constructor(protected http: HttpClient) { }
  public get(params?: HttpParams): Observable<T[]> {
    return this.http.get<T[]>(this.baseUrl, { params });
  }
  public getOne(id: string | number, params?: HttpParams): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`, { params });
  }
  public save(payload: Partial<T>, params?: HttpParams): Observable<T> {
    if (payload.id) {
      return this.http.put<T>(`${this.baseUrl}/${payload.id}`, payload, { params });
    }
    return this.http.post<T>(this.baseUrl, payload, { params });
  }
  public patch(id: string | number, payload: Partial<T>, params?: HttpParams): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}`, payload, { params });
  }
  public remove(ids: string | number | string[] | number[], params?: HttpParams): Observable<void> {
    if (isArray(ids)) {
      return this.http.post<void>(`${this.baseUrl}/bulkdelete`, { ids }, { params });
    }
    return this.http.delete<void>(`${this.baseUrl}/${ids}`, { params });
  }
}
