import {Injectable} from '@angular/core';
import {EntityCollectionServiceBase, EntityCollectionServiceElementsFactory, MergeStrategy} from '@ngrx/data';
import {Payroll} from '../../../models/payroll.model';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';

@Injectable({providedIn: 'root'})
export class PayrollEntityService extends EntityCollectionServiceBase<Payroll> {
  constructor(ef: EntityCollectionServiceElementsFactory, private http: HttpClient) {
    super('Payroll', ef);
  }
  public patch(payload: {id: number}): Observable<void> {
    return this.http.patch<void>(`api/payroll/${payload.id}`, payload)
      .pipe(tap(() => this.getByKey(payload.id)));
  }
  public getPreview(batchId: string): Observable<Payroll> {
    return this.http.get<Payroll>(`api/payroll/preview/${batchId}`);
  }
}
