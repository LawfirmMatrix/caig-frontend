import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class DecryptService {
  constructor(private http: HttpClient) { }
  public decrypt(employeeId: number, property: string): Observable<any> {
    return this.http.get<any>(`/api/employee/${employeeId}/${property}`);
  }
}
