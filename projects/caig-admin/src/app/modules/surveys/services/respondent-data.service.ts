import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {Respondent} from '../../../models/respondent.model';

@Injectable({providedIn: 'root'})
export class RespondentDataService {
  constructor(private http: HttpClient) { }
  public patch(id: string, payload: Partial<Respondent<any>>): Observable<void> {
    return this.http.patch<void>(`api/respondent/${id}`, payload);
  }
}
