import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TaxDetail} from '../../../models/tax-detail.model';
import {omitBy} from 'lodash-es';

@Injectable({providedIn: 'root'})
export class ReportDataService {
  private static readonly baseUrl = 'api/report';
  constructor(private http: HttpClient) { }
  public taxDetail(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string, includeSsn?: boolean): Observable<TaxDetail[]> {
    const params = sanitizeParams(fromDate, toDate, allSettlements, taxState, includeSsn);
    return this.http.get<TaxDetail[]>(`${ReportDataService.baseUrl}/taxdetail`, { params });
  }
  public paymentDetail(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string, includeSsn?: boolean): Observable<TaxDetail[]> {
    const params = sanitizeParams(fromDate, toDate, allSettlements, taxState, includeSsn);
    return this.http.get<TaxDetail[]>(`${ReportDataService.baseUrl}/paymentdetail`, { params });
  }
}

function sanitizeParams(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string, includeSsn?: boolean): any {
  return omitBy({ fromDate, toDate, allSettlements, taxState, includeSsn }, (p) => p === undefined || p === null);
}
