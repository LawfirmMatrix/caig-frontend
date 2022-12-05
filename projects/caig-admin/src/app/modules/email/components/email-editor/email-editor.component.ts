import {Component, Input, Inject, OnInit, OnDestroy} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {filter, tap, distinctUntilChanged, debounceTime, Observable, of, ReplaySubject, combineLatest} from 'rxjs';
import {isNotUndefined} from '../../../../core/util/functions';
import {FieldBase, InputField, AutocompleteField, CheckboxField} from 'dynamic-form';
import {UntypedFormGroup} from '@angular/forms';
import {emailTemplates, emailSignatures} from '../../store/selectors/email.selectors';
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
import {switchMap, map, takeUntil} from 'rxjs/operators';
import {EmailPreviewComponent, EmailPreviewData} from '../email-preview/email-preview.component';
import {NotificationsService} from 'notifications';
import {EmailEditor} from '../email-editor';
import {ConfirmDialogComponent} from 'shared-components';
import {Employee} from '../../../../models/employee.model';
import {SignatureBlock} from '../../../../models/signature.model';
import {SignatureEditorComponent} from '../signature-editor/signature-editor.component';
import {SignatureBlockService} from '../../../../core/services/signature-block.service';

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss'],
})
export class EmailEditorComponent extends EmailEditor implements OnInit, OnDestroy {
  @Input() public addressForm!: UntypedFormGroup;
  @Input() public employee: Employee | undefined;
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
        appearance: 'standard',
      }),
    ]
  ];
  public eventFields: FieldBase<any>[][] = [
    [
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
      }),
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
    ]
  ];
  public signatureBody = '';
  public signatureForm = new UntypedFormGroup({});
  public signatureFields!: FieldBase<any>[][];
  private onDestroy$ = new ReplaySubject<void>();
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
    private signatureService: SignatureBlockService,
  ) {
    super(document);
  }
  public ngOnInit() {
    const signatureId$ = this.route.queryParams
      .pipe(
        map((qp) => qp['signatureId']),
        filter(isNotUndefined),
        distinctUntilChanged(),
      );
    const templateId$ = this.route.queryParams
      .pipe(
        map((qp) => qp['templateId']),
        filter(isNotUndefined),
        distinctUntilChanged(),
      );
    const signatures$ = this.store.select(emailSignatures).pipe(
      tap((signatures) => {
        if (!signatures) {
          this.store.dispatch(EmailActions.loadEmailSignatures());
        }
      }),
      filter(isNotUndefined),
    );

    this.signatureFields = [
      [
        new AutocompleteField({
          key: 'signatureId',
          label: 'Template',
          options: signatures$,
          itemKey: 'id',
          displayField: 'title',
          fxFlex: 0,
          value: this.route.snapshot.queryParams['signatureId'],
          onChange: (value) => this.router.navigate([], {queryParams: {signatureId: value}, queryParamsHandling: 'merge'}),
          onAddItem: () => this.openSignature(),
          appearance: 'standard',
        }),
      ]
    ];

    templateId$
      .pipe(
        debounceTime(100),
        switchMap((templateId) => this.employee ? this.loadingService.load(
          this.emailService.getEmployeeTemplate(templateId, this.employee.id)
        ) : of(null)),
        takeUntil(this.onDestroy$),
      )
      .subscribe((template) => {
        if (template) {
          this.emailBody = template.body;
          this.subjectForm.patchValue({subject: template.subject, templateId: template.id});
        }
      });

    combineLatest([signatureId$, signatures$])
      .pipe(
        map(([signatureId, signatures]) => signatures.find((s) => s.id === signatureId)),
        takeUntil(this.onDestroy$)
      )
      .subscribe((signature) => {
        if (signature) {
          this.signatureBody = signature.signature;
        }
      });
  }
  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }
  public preview(): void {
    if (this.employee) {
      const employee: Employee = this.employee;
      this.loadingService.load(this.emailService.renderEmail(
        employee.id,
        this.subjectForm.value['subject'],
        this.emailBody,
      )).pipe(
        switchMap((preview) => {
          const bodyRendered = this.signatureBody ?
            (preview.bodyRendered + '<br/>'.repeat(3) + this.signatureBody) : preview.bodyRendered;
          const data: EmailPreviewData = {
            toAddress: this.employees ?
              this.employees.map((e) => e.email || e.emailAlt).filter((email) => !!email) :
              [this.addressForm.value['toAddress']],
            fromAddress: this.addressForm.value['fromAddress'],
            ccAddress: this.addressForm.getRawValue()['ccAddress'],
            subjectRendered: preview.subjectRendered,
            bodyRendered,
            eventCode: this.eventForm.value['eventCode'],
            eventMessage: this.eventForm.value['eventMessage'],
          };
          const basePayload: Email = {
            fromAddress: data.fromAddress,
            ccAddress: data.ccAddress,
            body: bodyRendered,
            subject: preview.subjectRendered,
          };
          const request$: Observable<any> = this.employees ? this.emailService.bulkSendEmail({
            ...basePayload,
            batchId: this.route.snapshot.params['batchId'],
          }) : this.emailService.sendEmail({
            ...basePayload,
            toAddress: data.toAddress[0],
            toName: employee.name,
            employeeId: employee.id,
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
        this.router.navigate([this.employees ? '/employees' : '../view'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
      });
    }
  }
  public openTemplate(templateId?: string): void {
    if (this.employee) {
      const title = `${templateId ? 'Edit' : 'New'} Email Template`;
      const locals = templateId ? { templateId, employeeId: this.employee.id } : undefined;
      this.sidenavService.open<EmailTemplate>(title, TemplateEditorComponent, locals).subscribe((template) => {
        this.subjectForm.patchValue({templateId: template.id});
        this.emailBody = template.body;
      });
    }
  }
  public openSignature(signatureId?: string): void {
    const title = `${signatureId ? 'Edit' : 'New'} Email Signature`;
    const locals = signatureId ? { signatureId } : undefined;
    this.sidenavService.open<SignatureBlock>(title, SignatureEditorComponent, locals).subscribe((signature) => {
      this.signatureForm.patchValue({signatureId: signature.id});
      this.signatureBody = signature.signature;
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
        this.store.dispatch(EmailActions.removeEmailTemplate({templateId}))
        this.notifications.showSimpleInfoMessage('Successfully delete email template');
        this.subjectForm.reset();
        this.emailBody = '';
        this.router.navigate([], {queryParams: {templateId: null}, queryParamsHandling: 'merge'});
      });
  }
  public deleteSignature(): void {
    const title = 'Confirm Delete';
    const text = 'Are you sure you want to delete the selected email signature?';
    const signatureId = this.signatureForm.value['signatureId'];
    this.dialog.open(ConfirmDialogComponent, {data: {title, text}})
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(() => this.loadingService.load(this.signatureService.remove(signatureId)))
      )
      .subscribe(() => {
        this.store.dispatch(EmailActions.removeEmailSignature({signatureId}))
        this.notifications.showSimpleInfoMessage('Successfully delete email signature');
        this.signatureForm.reset();
        this.signatureBody = '';
        this.router.navigate([], {queryParams: {signatureId: null}, queryParamsHandling: 'merge'});
      });
  }
}
