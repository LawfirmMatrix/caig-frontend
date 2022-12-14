import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaxDetail} from '../../../models/tax-detail.model';
import {omitBy} from 'lodash-es';

@Injectable({providedIn: 'root'})
export class ReportDataService {
  private static readonly baseUrl = 'api/report';
  constructor(private http: HttpClient) { }
  public taxDetail(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string): Observable<TaxDetail[]> {
    const params: any = omitBy({ fromDate, toDate, allSettlements, taxState }, (p) => p === undefined || p === null);
    return this.http.get<TaxDetail[]>(`${ReportDataService.baseUrl}/taxdetail`, { params });
  }
}
