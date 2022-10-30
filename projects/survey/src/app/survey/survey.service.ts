import { Injectable } from '@angular/core';
import {FieldBase} from 'dynamic-form';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class SurveyService {
  constructor(private http: HttpClient) { }
  public get(): Observable<Survey[]> {
    return this.http.get<Survey[]>('/api-mock/survey');
  }
  public getOne(id: number | string): Observable<Survey> {
    return this.http.get<Survey>(`/api-mock/survey/${id}`);
  }
}

export interface Survey {
  id: number;
  name: string;
  fullName: string;
  location?: string;
  headerTitle?: string;
  headerContent?: string[];
  steps: SurveyStep[];
  estCompletionTime: string;
  nextSurvey?: (payload: any) => Survey | undefined;
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
