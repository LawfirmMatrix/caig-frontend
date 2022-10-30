import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User, UserRole} from '../../../models/session.model';
import {tap} from 'rxjs/operators';
import {NotificationsService} from 'notifications';

@Injectable({providedIn: 'root'})
export class UserDataService {
  private static readonly baseRoute = '/api/user';
  constructor(private http: HttpClient, private notifications: NotificationsService) { }
  public roles(): Observable<UserRole[]> {
    return this.http.get<UserRole[]>(`${UserDataService.baseRoute}/role`);
  }
  public getForSettlement(params?: any): Observable<User[]> {
    return this.http.get<User[]>(`${UserDataService.baseRoute}/forSettlement`, { params });
  }
  public patch(entityId: string | number, payload: Partial<User>, self?: boolean): Observable<User> {
    return this.http.patch<User>(`${UserDataService.baseRoute}/${self ? 'self' : entityId}`, payload)
      .pipe(tap(() => this.notifications.showSimpleInfoMessage(`Successfully updated ${self ? 'your profile' : 'user'}.`)));
  }
}
