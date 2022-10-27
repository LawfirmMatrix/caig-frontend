import {Component, OnInit} from '@angular/core';
import {ToolbarButton} from '../toolbar-buttons/toolbar-buttons.component';
import {EmailService, EmailTemplateShort, EmployeeEmailTemplate} from '../../../../../core/services/email.service';
import {AutocompleteField, FieldBase, InputField, SelectField} from 'dynamic-form';
import {filter, first, map, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {NotificationsService} from 'notifications';
import {FormGroup} from '@angular/forms';
import {isEqual} from 'lodash-es';
import {MatDialog} from '@angular/material/dialog';
import {BehaviorSubject, combineLatest, of} from 'rxjs';
import {Employee} from '../../../../../models/employee.model';
import {EmployeeEntityService} from '../../../../employees/services/employee-entity.service';
import {EventService} from '../../../../../core/services/event.service';
import {concatName, isNotUndefined} from '../../../../../core/util/functions';
import {ConfirmDialogComponent} from '../../../../../core/components/confirm-dialog.component';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/reducers';
import {eventTypes} from '../../../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../../../enums/store/actions/action-types';
import {emailTemplates} from '../../store/selectors/employees.selectors';
import {EmployeesActions} from '../../store/actions/action-types';
import {selectCoreState, user} from '../../../../../core/store/selectors/core.selectors';
import {coerceBooleanProperty} from '@angular/cdk/coercion';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent implements OnInit {
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'Employee',
      icon: 'chevron_left',
      routerLink: '../view',
    }
  ];
  public employee: Employee | undefined;
  public employeeAddresses$ = new BehaviorSubject<string[]>([]);
  public selectedTemplate: Partial<EmployeeEmailTemplate> = {};
  private _selectedTemplate: Partial<EmployeeEmailTemplate> = {};
  public templateSelection!: AutocompleteField<EmailTemplateShort>;
  public isLoading = false;
  public addressFields!: FieldBase<any>[][];
  public emailFields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'subject',
        label: 'Subject',
        required: true,
      })
    ],
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
      }),
      new InputField({
        key: 'eventMessage',
        label: 'Event Message',
      })
    ],
  ];
  public emailForm = new FormGroup({});
  public templateForm = new FormGroup({});
  public disableSend$ = this.emailForm.statusChanges
    .pipe(
      map((status) => status !== 'VALID'),
      startWith(true),
    );
  public bodyField: 'body' | 'bodyRendered' = 'body';
  constructor(
    private notifications: NotificationsService,
    private employeeService: EmployeeEntityService,
    private emailService: EmailService,
    private eventService: EventService,
    private dialog: MatDialog,
    private router: Router,
    private store: Store<AppState>,
    public route: ActivatedRoute,
  ) {
  }

  public ngOnInit() {
    const user$ = this.store.select(user).pipe(filter(isNotUndefined));
    const settlement$ = this.store.select(selectCoreState)
      .pipe(
        filter((state) => !!(state.settlementId && state.settlements)),
        map((state) => state.settlements?.find((s) => s.id === state.settlementId)),
        tap((settlement) => setTimeout(() => {
          if (settlement) {
            this.emailForm.patchValue({fromAddress: settlement.adminEmail, ccAddress: settlement.adminCc});
          }
        })))
      ;



    this.addressFields = [
      [
        new SelectField({
          key: 'fromAddress',
          label: 'From:',
          options: combineLatest([user$, settlement$]).pipe(
            map(([user, settlement]) => [settlement?.adminEmail, user.email].filter((e) => !!e).map((value) => ({value}))),
          ),
          itemKey: 'value',
          displayField: 'value',
          required: true,
        }),
        new SelectField({
          key: 'toAddress',
          label: 'To:',
          options: this.employeeAddresses$.pipe(
            map((emailAddresses) => emailAddresses.map((value) => ({value}))),
          ),
          itemKey: 'value',
          displayField: 'value',
          required: true,
        }),
        new InputField({
          key: 'ccAddress',
          label: 'Cc:',
          disabled: true,
        })
      ]
    ];


    combineLatest([this.route.params, this.employeeService.entityMap$.pipe(first())]).pipe(
      switchMap(([params, entityMap]: [any, any]) => {
        const cached = entityMap[Number(params.id)];
        return cached ? of(cached) : this.employeeService.getByKey(params.id);
      }),
      shareReplay(1),
    )
    combineLatest([this.route.params, this.employeeService.entityMap$.pipe(first())])
      .pipe(switchMap(([params, entityMap]: [any, any]) => {
        const cached = entityMap[Number(params.id)];
        return cached ? of(cached) : this.employeeService.getByKey(params.id);
      }))
      .subscribe((employee) => {
        const alt = coerceBooleanProperty((this.route.snapshot.queryParams as any).alt);
        this.employee = employee;
        setTimeout(() => this.emailForm.patchValue({toAddress: alt ? employee.emailAlt : employee.email}));
        const employeeAddresses: string[] = [];
        if (employee.emailAlt) {
          employeeAddresses.push(employee.emailAlt);
        }
        if (employee.email) {
          employeeAddresses.push(employee.email);
        }
        this.employeeAddresses$.next(employeeAddresses);
        this.fetchTemplate();
      });
    this.route.queryParams
      .pipe(
        map((qp: any) => qp.templateId),
        tap((templateId) => {
          this.selectedTemplate = templateId ? this.selectedTemplate : {};
          this._selectedTemplate = templateId ? this._selectedTemplate : {};
        }),
        filter((templateId) => !!templateId)
      )
      .subscribe(() => this.fetchTemplate());
    this.templateSelection = new AutocompleteField({
      key: 'templateId',
      label: 'Template',
      options: this.store.select(emailTemplates).pipe(
        tap((types) => {
          if (!types) {
            this.store.dispatch(EmployeesActions.loadEmailTemplates());
          }
        }),
        filter(isNotUndefined)
      ),
      displayField: 'title',
      itemKey: 'id',
      onChange: (value) => this.router.navigate([], {queryParams: {templateId: value}, queryParamsHandling: 'merge'}),
      onAddItem: () => this.router.navigate(['template'], {relativeTo: this.route, queryParamsHandling: 'preserve'}),
    });
  }

  public send(employee: Employee): void {
    this.isLoading = true;
    const formValue: any = this.emailForm.getRawValue();
    this.emailService.renderEmail(employee.id, formValue.subject, this.selectedTemplate && this.selectedTemplate[this.bodyField] || '')
      .pipe(
        switchMap((renderedEmail) => this.emailService.sendEmail({
          fromAddress: formValue.fromAddress,
          toAddress: formValue.toAddress,
          ccAddress: formValue.ccAddress,
          toName: concatName(employee),
          employeeId: employee.id,
          body: renderedEmail.bodyRendered,
          subject: renderedEmail.subjectRendered,
        }))
      )
      .subscribe(() => {
        this.notifications.showSimpleInfoMessage(`Successfully sent email to ${formValue.toAddress}`);
        this.router.navigate(['../view'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
      }, () => this.isLoading = false);
  }

  public deleteTemplate(): void {
    const title = 'Confirm Delete';
    const text = 'Are you sure you want to delete the selected email template?';
    this.dialog.open(ConfirmDialogComponent, {data: {title, text}})
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        tap(() => this.isLoading = true),
        switchMap(() => this.emailService.deleteTemplate(this.selectedTemplate.id as string))
      )
      .subscribe(() => {
        this.isLoading = false;
        this.store.dispatch(EmployeesActions.removeEmailTemplate({templateId: this.selectedTemplate.id as string}))
        this.notifications.showSimpleInfoMessage('Successfully delete email template');
        this.templateForm.reset();
        this.emailForm.reset();
        this.selectedTemplate = {};
        this._selectedTemplate = {};
        this.router.navigate([], {queryParams: {templateId: null}, queryParamsHandling: 'merge'});
      }, () => this.isLoading = false);
  }

  public insertPlaceholder(field: string): void {
    this.emailForm.patchValue({subject: `${(this.emailForm.value as any).subject || ''}{{${field}}} `});
  }

  public togglePreview(render: boolean): void {
    const emailFormValue: any = this.emailForm.value;
    const template = {
      ...this.selectedTemplate,
      subject: emailFormValue.subject,
    };
    if (render && !isEqual(template, this._selectedTemplate)) {
      const subject = emailFormValue.subject || '';
      const body = template[this.bodyField] || '';
      const controls: any = this.emailForm.controls;
      const afterRender = () => {
        controls.subject.enable();
        this.toggleFields(render);
      };
      controls.subject.disable();
      this.isLoading = true;
      this.emailService.renderEmail((this.route.snapshot.params as any).id, subject, body)
        .subscribe((renderedEmail) => {
          this.selectedTemplate = { ...this._selectedTemplate, ...renderedEmail };
          this._selectedTemplate = { ...this.selectedTemplate };
          this.isLoading = false;
          setTimeout(() => afterRender());
        }, () => afterRender());
    } else {
      // @TODO
      // this.template = template;
      // this._template = { ...template };
      this.toggleFields(render);
    }
  }

  private fetchTemplate(): void {
    const queryParams: any = this.route.snapshot.queryParams;
    if (queryParams.templateId && this.employee) {
      this.isLoading = true;
      this.emailService.getEmployeeTemplate(queryParams.templateId, this.employee.id)
        .subscribe((template) => {
          this.selectedTemplate = template;
          this._selectedTemplate = { ...template };
          this.isLoading = false;
        }, () => this.isLoading = false);
    }
  }

  private toggleFields(render: boolean): void {
    this.bodyField = render ? 'bodyRendered' : 'body';
    this.emailForm.patchValue({subject: this.selectedTemplate[render ? 'subjectRendered' : 'subject']});
  }
}
