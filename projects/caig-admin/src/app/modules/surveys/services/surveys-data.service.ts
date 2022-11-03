import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Survey} from '../../../models/survey.model';

@Injectable({providedIn: 'root'})
export class SurveysDataService {
  constructor(private http: HttpClient) { }
  public get(): Observable<Survey[]> {
    return this.http.get<Survey[]>('api/survey');
  }
}
