import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityDataService} from '../util/entity-data.service';
import {SignatureBlock} from '../../models/signature.model';
import {NotificationsService} from 'notifications';

@Injectable({providedIn: 'root'})
export class SignatureBlockService extends EntityDataService<SignatureBlock> {
  protected baseUrl = 'api/email/signatureblock';
  protected entityName = { single: 'signature block', plural: 'signature blocks' };
  constructor(
    protected override http: HttpClient,
    protected override notifications: NotificationsService,
  ) {
    super(http, notifications);
  }
}
