import { Injectable } from '@angular/core';
import { cloneDeep } from 'lodash-es';
import { MockApiService } from 'mock-api';
import {SurveySchema} from '../../survey/survey.service';
import {schemas} from './data';

@Injectable({providedIn: 'root'})
export class SurveyMockApi {
  private readonly _schemas: SurveySchema[] = schemas;
  constructor(private _mockApiService: MockApiService) {
    this.registerHandlers();
  }
  public registerHandlers(): void {
    this._mockApiService
      .onGet('api-mock/survey/schema')
      .reply(() => [200, cloneDeep(this._schemas)]);
    this._mockApiService
      .onGet('api-mock/survey/schema/:id')
      .reply((request) => {
        const id = Number(request.urlParams['id']);
        const schema = this._schemas.find((q) => q.id === id);
        if (schema) {
          return [200, cloneDeep(schema)];
        }
        return [400, 'INVALID ID'];
      });
  }
}
