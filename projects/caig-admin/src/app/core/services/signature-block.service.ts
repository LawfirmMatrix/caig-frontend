import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EntityDataService} from '../util/entity-data.service';
import {SignatureBlock} from '../../models/signature.model';

@Injectable({providedIn: 'root'})
export class SignatureBlockService extends EntityDataService<SignatureBlock> {
  protected baseUrl = 'api/email/signatureblock';
  constructor(protected override http: HttpClient) {
    super(http);
  }
}
