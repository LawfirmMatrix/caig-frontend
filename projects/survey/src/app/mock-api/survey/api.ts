import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { MockApiService } from 'mock-api';
import {Survey} from '../../survey/survey.service';
import {surveys} from './data';

@Injectable({providedIn: 'root'})
export class QuestionnaireMockApi {
  private readonly _surveys: Survey[] = surveys;
  constructor(private _mockApiService: MockApiService) {
    this.registerHandlers();
  }
  public registerHandlers(): void {
    this._mockApiService
      .onGet('api-mock/survey')
      .reply(() => [200, cloneDeep(this._surveys)]);
    this._mockApiService
      .onGet('api-mock/survey/:id')
      .reply((request) => {
        const id = Number(request.urlParams['id']);
        const questionnaire = this._surveys.find((q) => q.id === id);
        if (questionnaire) {
          return [200, cloneDeep(questionnaire)];
        }
        return [400, 'INVALID ID'];
      });
  }
}
