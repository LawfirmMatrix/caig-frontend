import {Injectable} from '@angular/core';
import {Respondent} from '../../../models/respondent.model';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class RespondentDataService {
  constructor(private http: HttpClient) { }
  public get(params: {surveyId?: string | string[], locationId?: string | string[]}): Observable<Respondent[]> {
    return this.http.get<Respondent[]>('api/respondent', { params });
  }
  public getOne(respondentId: string): Observable<Respondent> {
    return this.http.get<Respondent>(`api/respondent/${respondentId}`);
  }
  public patch(id: string, payload: Partial<Respondent>): Observable<void> {
    return this.http.patch<void>(`api/respondent/${id}`, payload);
  }
  public getPDF(pdfId: string): Observable<any> {
    return this.http.get(`api/respondent/response/${pdfId}`, {responseType: 'blob'});
  }
  public remove(id: string): Observable<void> {
    return this.http.delete<void>(`api/respondent/${id}`);
  }
}
