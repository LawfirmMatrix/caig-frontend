import {Injectable} from '@angular/core';
import {AllEntityResolver} from '../../../core/services/all-entity.resolver';
import {Resolve} from '@angular/router';
import {SettlementEntityService} from './settlement-entity.service';

@Injectable({providedIn: 'root'})
export class AllSettlementsResolver extends AllEntityResolver implements Resolve<any> {
  constructor(protected dataService: SettlementEntityService) {
    super(dataService);
  }
}
