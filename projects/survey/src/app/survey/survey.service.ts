import { Injectable } from '@angular/core';
import {FieldBase} from 'dynamic-form';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {shareReplay} from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class SurveyService {
  public initialize$: Observable<Survey> = this.initialize().pipe(shareReplay(1));
  constructor(private http: HttpClient) { }
  public initialize(): Observable<Survey> {
    return this.http.get<Survey>('api/survey/initialize');
  }
  public getAllSchemas(): Observable<SurveySchema[]> {
    return this.http.get<SurveySchema[]>(`api-mock/survey/schema`);
  }
  public getSchema(id: number | string): Observable<SurveySchema> {
    return this.http.get<SurveySchema>(`api-mock/survey/schema/${id}`);
  }
  public submit(payload: any, surveyId: string, locationId?: string, nomail?: boolean): Observable<any> {
    const params: any = {
      nomail: typeof nomail === 'boolean' ? nomail : !environment.production,
      surveyId,
      locationId,
    };
    return this.http.post<any>('api/survey/submit', payload, { params });
  }
  public getProgress(sessionId: string): Observable<any> {
    return this.http.get<any>(`api/survey/${sessionId}/progress`);
  }
  public saveProgress(payload: any, sessionId?: string): Observable<any> {
    const route = `api/survey/${sessionId ? `${sessionId}/` : ''}progress`;
    return this.http.post<any>(route, payload);
  }
}

export interface Survey extends SurveyLocation {
  schemaId: number;
  estTime: string;
  locations: SurveyLocation[];
}

export interface SurveyLocation {
  id: string;
  name: string;
  shortcut?: string;
}

export interface SurveySchema {
  id: number;
  name: string;
  fullName: string;
  location?: string;
  headerTitle?: string;
  headerContent?: string[];
  steps: SurveyStep[];
  estCompletionTime: string;
  logo?: { url: string, width: string, height: string };
  toolbarStyle?: { [style: string]: any };
  backgroundStyle?: { [style: string]: any };
  foregroundStyle?: { [style: string]: any };
}

export interface SurveyStep {
  title: string;
  headings?: SurveyStepHeading[];
  questions: SurveyQuestion[];
  isValid?: (formValue: any) => { valid: boolean; errorMessage?: string; };
  onChange?: (formValue: any) => SurveyStepOnChange;
  onNext?: (formValue: any) => SurveyStepOnNext;
  completed?: boolean;
  skipped?: boolean;
}

export interface SurveyQuestion {
  question: string;
  fields: FieldBase<any>[][];
  handsetFields?: FieldBase<any>[][];
  invalid?: (formValue: any) => boolean;
}

export interface SurveyStepOnChange {
  modifyQuestions?: {stepIndex: number, questionIndex: number, modifiedQuestion: string }[];
}

export interface SurveyStepOnNext {
  skipToStepIndex?: number;
}

export interface SurveyStepHeading {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}
