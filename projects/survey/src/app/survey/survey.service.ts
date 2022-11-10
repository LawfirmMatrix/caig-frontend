import { Injectable } from '@angular/core';
import {FieldBase} from 'dynamic-form';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError, throwError} from 'rxjs';
import {environment} from '../../environments/environment';
import {shareReplay} from 'rxjs/operators';
import {NotificationsService} from 'notifications';
import {UntypedFormGroup} from '@angular/forms';

@Injectable({providedIn: 'root'})
export class SurveyService {
  public initializeError = false;
  public initialize$: Observable<Survey> = this.initialize().pipe(shareReplay(1));
  constructor(private http: HttpClient, private notifications: NotificationsService) { }
  public initialize(): Observable<Survey> {
    return this.errorHandler(this.http.get<Survey>('api/survey/initialize')).pipe(
      catchError((err) => {
        this.initializeError = true;
        return throwError(err);
      })
    );
  }
  public getAllSchemas(): Observable<SurveySchema[]> {
    return this.errorHandler(this.http.get<SurveySchema[]>(`api-mock/survey/schema`));
  }
  public getSchema(id: number | string): Observable<SurveySchema> {
    return this.errorHandler(this.http.get<SurveySchema>(`api-mock/survey/schema/${id}`));
  }
  public submit(payload: any, surveyId: string, locationId?: string, nomail?: boolean): Observable<any> {
    const params: any = {
      nomail: typeof nomail === 'boolean' ? nomail : !environment.production,
      surveyId,
      locationId,
    };
    return this.errorHandler(this.http.post<any>('api/survey/submit', payload, { params }));
  }
  public getProgress(sessionId: string): Observable<any> {
    return this.errorHandler(this.http.get<any>(`api/survey/${sessionId}/progress`));
  }
  public saveProgress(payload: any, sessionId?: string): Observable<any> {
    const route = `api/survey/${sessionId ? `${sessionId}/` : ''}progress`;
    return this.errorHandler(this.http.post<any>(route, payload));
  }
  private errorHandler(request$: Observable<any>): Observable<any> {
    return request$.pipe(catchError((err) => {
      this.notifications.showDetailedMessage('An error has occurred', err);
      return throwError(err);
    }));
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
  form: UntypedFormGroup;
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
