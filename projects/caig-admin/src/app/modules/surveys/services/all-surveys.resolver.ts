import {Injectable} from '@angular/core';
import {Resolve} from '@angular/router';
import {AllEntityResolver} from '../../../core/services/all-entity.resolver';
import {SurveysEntityService} from './surveys-entity.service';

@Injectable()
export class AllSurveysResolver extends AllEntityResolver implements Resolve<any> {
  constructor(protected surveyService: SurveysEntityService) {
    super(surveyService);
  }
}
