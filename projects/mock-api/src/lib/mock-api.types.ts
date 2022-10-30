import { HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export type MockApiReplyCallback =
  | ((data: { request: HttpRequest<any>; urlParams: { [key: string]: string } }) => ([number, string | any]) | Observable<any>)
  | undefined;

export type MockApiMethods =
  | 'get'
  | 'post'
  | 'put'
  | 'patch'
  | 'delete';
