import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

// @TODO -- remove when authentication is implemented on back end
const token = 'Uzh4t4mRB3AGvbz99CeMcpkWHVb8hXRJ';

@Injectable({providedIn: 'root'})
export class PhoneService {
  private static readonly baseUrl = '/api-phone';
  constructor(private http: HttpClient) { }

  public lookup(phoneNumbers: string[]): Observable<PhoneNumberInfo[]> {
    return this.http.post<PhoneNumberInfo[]>(
      PhoneService.baseUrl + '/phoneNumber/lookup',
      phoneNumbers,
      { params: { token } }
    );
  }

  public sms(to: string, body: string): Observable<SMSResponse> {
    return this.http.post<SMSResponse>(
      PhoneService.baseUrl + '/sms',
      { to, body },
      { params: { token } }
    );
  }

  public bulkSms(to: string[], body: string): Observable<void> {
    return this.http.post<void>(
      PhoneService.baseUrl + '/sms/bulk',
      { to, body },
      { params: { token } }
    );
  }

  public ttsCall(to: string, body: string): Observable<SMSResponse> {
    return this.http.post<SMSResponse>(
      PhoneService.baseUrl + '/voice',
      { to, body },
      { params: { token } }
    );
  }

  public bulkTtsCall(to: string[], body: string): Observable<void> {
    return this.http.post<void>(
      PhoneService.baseUrl + '/voice/bulk',
      { to, body },
      { params: { token } }
    );
  }
}

export interface SMSResponse {
  accountSid: string;
  apiVersion: string;
  body: string;
  dateCreated: string;
  dateSent: string;
  dateUpdated: string;
  directions: any;
  errorCode: string;
  errorMessage: string;
  from: any;
  messagingServiceSid: string;
  numMedia: string;
  numSegments: string;
  price: string;
  priceUnit: string;
  sid: string;
  status: any;
  subresourceUris: { media: string };
  to: string;
  uri: string;
}

export interface PhoneNumberInfo {
  number: string;
  standardFormat: string;
  nationalFormat: string;
  countryCode: string;
  carrier: string;
  type: string;
  sms: boolean;
  error: string;
  errorCause: string;
}
