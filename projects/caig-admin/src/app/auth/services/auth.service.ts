import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import * as moment from 'moment';
import {AuthToken} from '../../models/token.model';
import {tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  private static readonly TOKEN_KEY = 'authToken';
  private static readonly SETTLEMENT_ID_KEY = 'settlementId';
  private static readonly AUTH_API = '/api-auth/token';

  private _loggedInPassword: string | undefined;

  public get loggedInPassword(): string | undefined {
    return this._loggedInPassword;
  }

  public static set token(token: AuthToken | null) {
    if (token) {
      localStorage.setItem(AuthService.TOKEN_KEY, JSON.stringify(token));
    } else {
      localStorage.removeItem(AuthService.TOKEN_KEY);
    }
  }
  public static get token(): AuthToken | null {
    const token = localStorage.getItem(AuthService.TOKEN_KEY);
    return token ? JSON.parse(token) : null;
  }

  public static set settlementId(settlementId: number | string | null) {
    if (settlementId !== null) {
      localStorage.setItem(AuthService.SETTLEMENT_ID_KEY, settlementId.toString());
    } else {
      localStorage.removeItem(AuthService.SETTLEMENT_ID_KEY);
    }
  }
  public static get settlementId(): number | null {
    const settlementId = localStorage.getItem(AuthService.SETTLEMENT_ID_KEY);
    return settlementId ? Number(settlementId) : null;
  }

  public static tokenNeedsRefresh(token: AuthToken): boolean {
    const hoursRemaining = AuthService.remainingTokenDuration(token);
    return hoursRemaining > 0 && hoursRemaining <= 1;
  }

  public static isTokenExpired(token: AuthToken): boolean {
    return AuthService.remainingTokenDuration(token) <= 0;
  }

  private static remainingTokenDuration(token: AuthToken): number {
    const end = moment(token.expires);
    if (end.isValid()) {
      const start = moment(new Date());
      const duration = moment.duration(end.diff(start));
      return duration.asHours();
    }
    return 0;
  }

  constructor(private http: HttpClient) { }

  public login(username: string, password: string): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${AuthService.AUTH_API}/jwt`, { username, password })
      .pipe(tap(() => this._loggedInPassword = password));
  }

  public refreshToken(): Observable<AuthToken> {
    return this.http.post<AuthToken>(`${AuthService.AUTH_API}/jwtrefresh`, null);
  }
}
