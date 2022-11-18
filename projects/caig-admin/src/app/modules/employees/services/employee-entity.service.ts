import {Injectable} from '@angular/core';
import {
  CorrelationIdGenerator,
  EntityActionOptions,
  EntityCollectionServiceBase,
  EntityCollectionServiceElementsFactory,
  MergeStrategy,
  QueryParams
} from '@ngrx/data';
import {Employee} from '../../../models/employee.model';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class EmployeeEntityService extends EntityCollectionServiceBase<Employee> {
  public activeCorrelationId: string | undefined;
  constructor(
    ef: EntityCollectionServiceElementsFactory,
    private cid: CorrelationIdGenerator,
    private http: HttpClient,
  ) {
    super('Employee', ef);
  }
  public override getAll(options?: EntityActionOptions): Observable<Employee[]> {
    this.activeCorrelationId = this.cid.next();
    return super.getAll({...options, correlationId: this.activeCorrelationId})
      .pipe(tap(() => this.activeCorrelationId = undefined));
  }
  public override getWithQuery(queryParams: QueryParams | string, options?: EntityActionOptions): Observable<Employee[]> {
    this.activeCorrelationId = this.cid.next();
    return super.getWithQuery(queryParams, {...options, correlationId: this.activeCorrelationId})
      .pipe(tap(() => this.activeCorrelationId = undefined));
  }
  public override cancel(correlationId: any = this.activeCorrelationId, reason?: string, options?: EntityActionOptions) {
    super.cancel(correlationId, reason, options);
    this.activeCorrelationId = undefined;
  }
  public override getByKey(key: any, options: EntityActionOptions = { mergeStrategy: MergeStrategy.OverwriteChanges }): Observable<Employee> {
    return super.getByKey(key, options);
  }
  public bulkPatch(payload: {ids: number[], value: Partial<Employee>}): Observable<void> {
    return this.http.patch<void>('/api/employee/bulk', payload);
  }
  public createBatch(employeeIds: number[]): Observable<{ batchId: string }> {
    return this.http.post<{batchId: string}>('api/employee/batch', employeeIds);
  }
}
