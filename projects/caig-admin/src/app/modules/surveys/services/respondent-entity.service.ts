import {Injectable} from '@angular/core';
import {Respondent} from '../../../models/respondent.model';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class RespondentEntityService extends EntityCollectionServiceBase<Respondent> {
  constructor(ef: EntityCollectionServiceElementsFactory, private http: HttpClient) {
    super('Respondent', ef);
  }
  // public get(params: {surveyId?: string | string[], locationId?: string | string[]}): Observable<Respondent[]> {
  //   return this.http.get<Respondent[]>('api/respondent', { params });
  // }
  // public getOne(respondentId: string): Observable<Respondent> {
  //   return this.http.get<Respondent>(`api/respondent/${respondentId}`);
  // }


  // @TODO - integrate with store
  public patch(id: string, payload: Partial<Respondent>): Observable<void> {
    return this.http.patch<void>(`api/respondent/${id}`, payload);
  }
}
