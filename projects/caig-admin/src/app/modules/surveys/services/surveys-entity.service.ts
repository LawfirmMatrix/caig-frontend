import {Injectable} from '@angular/core';
import {Survey} from '../../../models/survey.model';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';

@Injectable({providedIn: 'root'})
export class SurveysEntityService extends EntityCollectionServiceBase<Survey> {
  constructor(ef: EntityCollectionServiceElementsFactory) {
    super('Survey', ef);
  }
}
