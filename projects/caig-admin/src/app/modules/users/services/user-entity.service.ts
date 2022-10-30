import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {User} from '../../../models/session.model';

@Injectable({providedIn: 'root'})
export class UserEntityService extends EntityCollectionServiceBase<User> {
  constructor(ef: EntityCollectionServiceElementsFactory) {
    super('User', ef);
  }
}
