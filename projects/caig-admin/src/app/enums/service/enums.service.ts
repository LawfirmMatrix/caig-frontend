import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {EmployeeStatus, EventType, ParticipationStatus} from '../../models/employee.model';
import {EnumDataService} from '../store/reducers';

@Injectable()
export class EnumsService implements EnumDataService {
  constructor(private http: HttpClient) { }
  public bueLocations(): Observable<string[]> {
    return this.http.get<string[]>('/api/location');
  }
  public bueLocals(): Observable<string[]> {
    return this.http.get<string[]>('/api/location/local');
  }
  public bueRegions(): Observable<string[]> {
    return this.http.get<string[]>('/api/location/region');
  }
  public settlementStates(): Observable<string[]> {
    return this.http.get<string[]>('/api/enum/state', { params: { inSettlement: true } });
  }
  public participationStatuses(): Observable<ParticipationStatus[]> {
    return this.http.get<ParticipationStatus[]>('/api/enum/participationStatus');
  }
  public employeeStatuses(): Observable<EmployeeStatus[]> {
    return this.http.get<EmployeeStatus[]>('/api/enum/employeeStatus');
  }
  public eventTypes(): Observable<EventType[]> {
    return this.http.get<EventType[]>('/api/event/type', { params: { group: 'Call Project' }});
  }
}
