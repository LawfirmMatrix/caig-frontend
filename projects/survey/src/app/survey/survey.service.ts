import { Injectable } from '@angular/core';
import {FieldBase} from 'dynamic-form';
import {HttpClient} from '@angular/common/http';
import {Observable, map} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) { }
  public get(params?: any): Observable<Survey[]> {
    return this.http.get<Survey[]>('assets/surveys.json');
    // return this.http.get<Survey[]>(SurveyService.BASE_URL, { params });
  }
  public getOne(id: number | string): Observable<Survey> {
    return this.get().pipe(map((data) => data.find((d) => d.id === id) as Survey));
    // return this.http.get<Survey>(`/api/survey/${id}`);
  }
  public getSchemas(): Observable<SurveySchema[]> {
    return this.http.get<SurveySchema[]>(`api-mock/survey/schema`);
  }
  public getOneSchema(id: number | string): Observable<SurveySchema> {
    return this.http.get<SurveySchema>(`api-mock/survey/schema/${id}`);
  }
  public submit(payload: any, surveyId: string, sessionId?: string, respondentId?: string, nomail?: boolean): Observable<any> {
    const route = `api/survey/${sessionId ? `${sessionId}/` : ''}submit`;
    const params: any = { nomail: nomail || !environment.production, surveyId };
    if (respondentId) {
      params.respondentId = respondentId;
    }
    return this.http.post<any>(route, payload, { params });
  }
}

export interface Survey {
  id: string;
  schemaId: number;
  title: string;
  estTime: string;
  locations: string[]; // @TODO - api
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
  nextSurvey?: (payload: any) => SurveySchema | undefined;
  logo?: { url: string, width: string, height: string };
  toolbarStyle?: { [style: string]: any };
  surveyStyle?: { [style: string]: any };
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
