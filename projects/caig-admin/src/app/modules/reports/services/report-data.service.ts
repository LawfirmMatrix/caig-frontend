import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, catchError, of} from 'rxjs';
import {TaxDetail, StateTaxDetail} from '../../../models/tax-detail.model';
import {omitBy} from 'lodash-es';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class ReportDataService {
  private static readonly baseUrl = 'api/report';
  constructor(private http: HttpClient, private router: Router) { }
  public taxDetail(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string, includeSsn?: boolean): Observable<TaxDetail[]> {
    const params = sanitizeParams(fromDate, toDate, allSettlements, taxState, includeSsn);
    return this.decryptionErrorHandler(this.http.get<TaxDetail[]>(`${ReportDataService.baseUrl}/taxdetail`, { params }), includeSsn);
  }
  public paymentDetail(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string, includeSsn?: boolean): Observable<TaxDetail[]> {
    const params = sanitizeParams(fromDate, toDate, allSettlements, taxState, includeSsn);
    return this.decryptionErrorHandler(this.http.get<TaxDetail[]>(`${ReportDataService.baseUrl}/paymentdetail`, { params }), includeSsn);
  }
  public stateTaxDetail(fromDate?: string, toDate?: string): Observable<StateTaxDetail[]> {
    const params = sanitizeParams(fromDate, toDate);
    return this.http.get<StateTaxDetail[]>(`${ReportDataService.baseUrl}/statetaxdetail`, { params });
  }
  private decryptionErrorHandler(request$: Observable<any>, includeSsn: boolean | undefined): Observable<any> {
    return request$.pipe(
      catchError((err) => {
        if (includeSsn) {
          this.router.navigate([], {queryParams: { includeSsn: false }, queryParamsHandling: 'merge', replaceUrl: true });
        }
        return of([]);
      })
    )
  }
}

function sanitizeParams(fromDate?: string, toDate?: string, allSettlements?: boolean, taxState?: string, includeSsn?: boolean): any {
  return omitBy({ fromDate, toDate, allSettlements, taxState, includeSsn }, (p) => p === undefined || p === null);
}
