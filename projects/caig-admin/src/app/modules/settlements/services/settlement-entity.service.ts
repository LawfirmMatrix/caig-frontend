import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {Settlement} from '../../../models/settlement.model';

@Injectable({providedIn: 'root'})
export class SettlementEntityService extends EntityCollectionServiceBase<Settlement> {
  constructor(ef: EntityCollectionServiceElementsFactory) {
    super('Settlement', ef);
  }
}
