import { Injectable } from '@angular/core';
import {FieldBase} from 'dynamic-form';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor() { }
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
