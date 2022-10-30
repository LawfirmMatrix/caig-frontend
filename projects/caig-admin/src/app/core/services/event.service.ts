import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NotificationsService} from 'notifications';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {EmployeeEvent, GeneralEvent} from '../../models/employee.model';

@Injectable({providedIn: 'root'})
export class EventService {
  constructor(protected http: HttpClient, protected notifications: NotificationsService) {}
  public get(params?: any): Observable<GeneralEvent[]> {
    return this.http.get<GeneralEvent[]>('/api/event', {params});
  }
  public addForEmployee(employeeId: number, payload: Partial<EmployeeEvent>): Observable<void> {
    return this.http.post<void>(`/api/event/forEmployee/${employeeId}`, payload)
      .pipe(tap(() => this.notifications.showSimpleInfoMessage('Successfully added event')));
  }
  public remove(eventId: number): Observable<void> {
    return this.http.delete<void>(`/api/event/${eventId}`)
      .pipe(tap(() => this.notifications.showSimpleInfoMessage('Successfully deleted event')));
  }
}
