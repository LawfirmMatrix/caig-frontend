import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class EmailService {
  private static readonly baseUrl = '/api/email';
  constructor(private http: HttpClient) { }

  public getTemplates(): Observable<EmailTemplateShort[]> {
    return this.http.get<EmailTemplateShort[]>(`${EmailService.baseUrl}/template`);
  }

  public getOneTemplate(templateId: string): Observable<EmailTemplate> {
    return this.http.get<EmailTemplate>(`${EmailService.baseUrl}/template/${templateId}`);
  }

  public getEmployeeTemplate(templateId: string, employeeId: string | number): Observable<EmployeeEmailTemplate> {
    return this.http.get<EmployeeEmailTemplate>(`${EmailService.baseUrl}/template/${templateId}/forEmployee/${employeeId}`);
  }

  public saveTemplate(template: Partial<EmailTemplate>): Observable<EmailTemplate> {
    if (template.id) {
      return this.http.put<EmailTemplate>(`${EmailService.baseUrl}/template/${template.id}`, template);
    }
    return this.http.post<EmailTemplate>(`${EmailService.baseUrl}/template`, template);
  }

  public deleteTemplate(templateId: string): Observable<void> {
    return this.http.delete<void>(`${EmailService.baseUrl}/template/${templateId}`);
  }

  public getTemplatePlaceholders(): Observable<string[]> {
    return this.http.get<string[]>(`${EmailService.baseUrl}/template/field`);
  }

  public sendEmail(email: ComposedEmail): Observable<ComposedEmail> {
    return this.http.post<ComposedEmail>(`${EmailService.baseUrl}`, email);
  }

  public getEmail(emailId: string): Observable<ComposedEmail> {
    return this.http.get<ComposedEmail>(`${EmailService.baseUrl}/${emailId}`);
  }

  public renderEmail(employeeId: number, subject: string, body: string): Observable<RenderedEmail> {
    return this.http.post<RenderedEmail>(`${EmailService.baseUrl}/template/forEmployee/${employeeId}`, { subject, body });
  }
}

export interface EmailTemplateShort {
  id: string;
  title: string;
}

export interface EmailTemplate extends EmailTemplateShort {
  subject: string;
  body: string;
}

export interface EmployeeEmailTemplate extends EmailTemplate {
  subjectRendered: string;
  bodyRendered: string;
}

export interface ComposedEmail {
  toAddress: string;
  toName: string;
  fromAddress: string;
  ccAddress?: string;
  subject: string;
  body: string;
  employeeId: number;
  eventCode?: number;
  eventMessage?: string;
}

export interface RenderedEmail {
  subject: string;
  subjectRendered: string;
  body: string;
  bodyRendered: string;
}
