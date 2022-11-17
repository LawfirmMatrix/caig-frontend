import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory} from '@ngrx/data';
import {Payroll} from '../../../models/payroll.model';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PayrollEntityService extends EntityCollectionServiceBase<Payroll> {
  constructor(ef: EntityCollectionServiceElementsFactory, private http: HttpClient) {
    super('Payroll', ef);
  }
  public getPreview(batchId: string): Observable<Payroll> {
    return this.http.get<Payroll>(`api/payroll/preview/${batchId}`);
  }
}
