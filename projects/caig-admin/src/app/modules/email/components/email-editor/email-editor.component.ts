import {Component, Input, Inject, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {filter, tap, distinctUntilChanged, debounceTime, Observable} from 'rxjs';
import {isNotUndefined} from '../../../../core/util/functions';
import {FieldBase, InputField, AutocompleteField, CheckboxField} from 'dynamic-form';
import {UntypedFormGroup} from '@angular/forms';
import {emailTemplates} from '../../store/selectors/email.selectors';
import {EmailActions} from '../../store/actions/action-types';
import {eventTypes} from '../../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../../enums/store/actions/action-types';
import {SidenavStackService} from 'sidenav-stack';
import {TemplateEditorComponent} from '../template-editor/template-editor.component';
import {EmailTemplate, EmailService, Email} from '../../../../core/services/email.service';
import {DOCUMENT} from '@angular/common';
import {LoadingService} from '../../../../core/services/loading.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {switchMap, map} from 'rxjs/operators';
import {EmailPreviewComponent, EmailPreviewData} from '../email-preview/email-preview.component';
import {NotificationsService} from 'notifications';
import {EmailEditor} from '../email-editor';
import {ConfirmDialogComponent} from 'shared-components';
import {EmployeesActions} from '../../../shared/employee/store/actions/action-types';
import {Employee} from '../../../../models/employee.model';

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss'],
})
export class EmailEditorComponent extends EmailEditor implements OnInit {
  @Input() public addressForm!: UntypedFormGroup;
  @Input() public employee!: Employee;
  @Input() public employees: Employee[] | undefined;
  public eventForm = new UntypedFormGroup({});
  public subjectFields: FieldBase<any>[][] = [
    [
      this.subjectField,
      new AutocompleteField({
        key: 'templateId',
        label: 'Template',
        options: this.store.select(emailTemplates).pipe(
          tap((templates) => {
            if (!templates) {
              this.store.dispatch(EmailActions.loadEmailTemplates());
            }
          }),
          filter(isNotUndefined),
        ),
        itemKey: 'id',
        displayField: 'title',
        fxFlex: 0,
        onChange: (value) => this.router.navigate([], {queryParams: {templateId: value}, queryParamsHandling: 'merge'}),
        onAddItem: () => this.openTemplate(),
      }),
    ]
  ];
  public eventFields: FieldBase<any>[][] = [
    [
      new CheckboxField({
        key: 'eventOverride',
        label: 'Override event',
        fxFlex: 0,
        onChange: (value, form) => {
          if (value) {
            form.enable({emitEvent: false});
          } else {
            form.disable({emitEvent: false});
            form.controls['eventOverride'].enable({emitEvent: false});
          }
        },
        value: false,
      }),
      new AutocompleteField({
        key: 'eventCode',
        label: 'Event',
        options: this.store.select(eventTypes).pipe(
          tap((types) => {
            if (!types) {
              this.store.dispatch(EnumsActions.loadEnums({enumType: 'eventTypes'}));
            }
          }),
          filter(isNotUndefined)
        ),
        itemKey: 'code',
        displayField: 'description',
        required: true,
        disabled: true,
      }),
      new InputField({
        key: 'eventMessage',
        label: 'Event Message',
        required: true,
        disabled: true,
      })
    ]
  ];
  constructor(
    @Inject(DOCUMENT) protected override document: Document,
    private store: Store<AppState>,
    private sidenavService: SidenavStackService,
    private emailService: EmailService,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private dialog: MatDialog,
    private router: Router,
    private notifications: NotificationsService,
  ) {
    super(document);
  }
  public ngOnInit() {
    this.route.queryParams
      .pipe(
        map((qp) => qp['templateId']),
        filter(isNotUndefined),
        distinctUntilChanged(),
        debounceTime(100),
        switchMap((templateId) => this.loadingService.load(
          this.emailService.getEmployeeTemplate(templateId, this.employee.id)
        ))
      )
      .subscribe((template) => {
        this.emailBody = template.body;
        this.subjectForm.patchValue({subject: template.subject, templateId: template.id});
      });
  }
  public preview(): void {
    this.loadingService.load(this.emailService.renderEmail(
      this.employee.id,
      this.subjectForm.value['subject'],
      this.emailBody,
    )).pipe(
      switchMap((preview) => {
        const data: EmailPreviewData = {
          toAddress: this.employees ? this.employees.map((e) => e.email || e.emailAlt) : [this.addressForm.value['toAddress']],
          fromAddress: this.addressForm.value['fromAddress'],
          ccAddress: this.addressForm.getRawValue()['ccAddress'],
          subjectRendered: preview.subjectRendered,
          bodyRendered: preview.bodyRendered,
          eventCode: this.eventForm.value['eventCode'],
          eventMessage: this.eventForm.value['eventMessage'],
        };
        const basePayload: Email = {
          fromAddress: data.fromAddress,
          ccAddress: data.ccAddress,
          body: preview.bodyRendered,
          subject: preview.subjectRendered,
        };
        const request$: Observable<any> = this.employees ? this.emailService.bulkSendEmail({
          ...basePayload,
          batchId: this.route.snapshot.params['batchId'],
        }) : this.emailService.sendEmail({
          ...basePayload,
          toAddress: data.toAddress[0],
          toName: this.employee.name,
          employeeId: this.employee.id,
        });
        return this.dialog.open<EmailPreviewComponent, EmailPreviewData, boolean>(EmailPreviewComponent, {data})
          .afterClosed()
          .pipe(
            filter((confirm) => !!confirm),
            switchMap(() => this.loadingService.load(request$))
          );
      }),
    ).subscribe(() => {
      this.notifications.showSimpleInfoMessage('Successfully sent email');
      this.router.navigate(['../view'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
    });
  }
  public openTemplate(templateId?: string): void {
    const title = `${templateId ? 'Edit' : 'New'} Email Template`;
    const locals = templateId ? { templateId, employeeId: this.employee.id } : undefined;
    this.sidenavService.open<EmailTemplate>(title, TemplateEditorComponent, locals).subscribe((template) => {
      this.subjectForm.patchValue({templateId: template.id});
      this.emailBody = template.body;
    });
  }
  public deleteTemplate(): void {
    const title = 'Confirm Delete';
    const text = 'Are you sure you want to delete the selected email template?';
    const templateId = this.subjectForm.value['templateId'];
    this.dialog.open(ConfirmDialogComponent, {data: {title, text}})
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(() => this.loadingService.load(this.emailService.deleteTemplate(templateId)))
      )
      .subscribe(() => {
        this.store.dispatch(EmployeesActions.removeEmailTemplate({templateId}))
        this.notifications.showSimpleInfoMessage('Successfully delete email template');
        this.subjectForm.reset();
        this.emailBody = '';
        this.router.navigate([], {queryParams: {templateId: null}, queryParamsHandling: 'merge'});
      });
  }
}
