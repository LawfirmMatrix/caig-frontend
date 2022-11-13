import {Component} from '@angular/core';
import {ToolbarButton} from '../toolbar-buttons/toolbar-buttons.component';
import {SelectField, InputField, AutocompleteField} from 'dynamic-form';
import {combineLatest, of} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, first, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {coerceBooleanProperty} from '@angular/cdk/coercion';
import {ComposedEmail, EmailService, EmployeeEmailTemplate} from '../../../../../core/services/email.service';
import {EmployeeEntityService} from '../../../../employees/services/employee-entity.service';
import {Employee} from '../../../../../models/employee.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/reducers';
import {emailTemplates} from '../../store/selectors/employees.selectors';
import {isNotUndefined} from '../../../../../core/util/functions';
import {EmployeesActions} from '../../store/actions/action-types';
import {ConfirmDialogComponent} from 'shared-components';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'notifications';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-compose-email',
  templateUrl: './compose-email.component.html',
  styleUrls: ['./compose-email.component.scss']
})
export class ComposeEmailComponent {
  public sendingEmail = false;
  public employee$ = combineLatest([this.route.params, this.employeeService.entityMap$.pipe(first())]).pipe(
    switchMap(([params, entityMap]) => {
      const cached = entityMap[Number(params['id'])];
      return cached ? of(cached) : this.employeeService.getByKey(params['id']);
    }),
    shareReplay(1),
  );
  public emailModel$ = combineLatest([this.route.queryParams, this.employee$])
    .pipe(
      map(([qp, employee]) => ({ to: [coerceBooleanProperty(qp['alt']) ? employee.emailAlt : employee.email], from: this.fromEmail }))
    );
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'Employee',
      icon: 'chevron_left',
      routerLink: '../view',
    }
  ];
  public fromEmail = 'demo@caig.co';
  public emailForm = new UntypedFormGroup({});
  public templateForm = new UntypedFormGroup({});
  public emailFields = [
    [
      new SelectField({
        key: 'from',
        label: 'From',
        required: true,
        options: of([
          { value: this.fromEmail }
        ]),
        itemKey: 'value',
        displayField: 'value',
        appearance: 'fill',
      })
    ],
    [
      new SelectField({
        key: 'to',
        label: 'To',
        required: true,
        options: this.employee$.pipe(
          map((e) => employeeToEmailArray(e).map((value) => ({value})))
        ),
        itemKey: 'value',
        displayField: 'value',
        multiple: true,
        appearance: 'fill',
      })
    ],
    [
      new InputField({
        key: 'subject',
        label: 'Subject',
        required: true,
        appearance: 'fill',
      })
    ]
  ];
  public selectedTemplate: Partial<EmployeeEmailTemplate> = {};
  private _selectedTemplate: Partial<EmployeeEmailTemplate> = {};
  public templateSelection = new AutocompleteField({
    key: 'templateId',
    label: 'Template',
    options: this.store.select(emailTemplates).pipe(
      tap((templates) => {
        if (!templates) {
          this.store.dispatch(EmployeesActions.loadEmailTemplates());
        }
      }),
      filter(isNotUndefined),
    ),
    displayField: 'title',
    itemKey: 'id',
    onChange: (value) => this.router.navigate([], {queryParams: {templateId: value}, queryParamsHandling: 'merge'}),
    onAddItem: () => this.router.navigate(['template'], {relativeTo: this.route, queryParamsHandling: 'preserve'}),
  });
  constructor(
    private store: Store<AppState>,
    private employeeService: EmployeeEntityService,
    private emailService: EmailService,
    private router: Router,
    private dialog: MatDialog,
    public route: ActivatedRoute,
    private notifications: NotificationsService
  ) { }
  public sendEmail(employee: Employee): void {
    this.sendingEmail = true;
    const email: ComposedEmail = {
      toAddress: (this.emailForm.value as any).to,
      toName: employee.name,
      // body: this.selectedTemplate.bodyRendered,
      employeeId: employee.id,
      ...this.emailForm.value as any,
    };
    this.emailService.sendEmail(email)
      .subscribe(() => {
        this.notifications.showSimpleInfoMessage('Successfully sent email to employee');
        this.router.navigate(['../view'], {relativeTo: this.route, queryParamsHandling: 'preserve'});
      }, () => this.sendingEmail = false);
  }
  public deleteTemplate(): void {
    const title = 'Confirm Delete';
    const text = 'Are you sure you want to delete the selected email template?';
    const formValue: any = this.templateForm.value;
    this.dialog.open(ConfirmDialogComponent, {data: {title, text}})
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(() => this.emailService.deleteTemplate(formValue.templateId))
      )
      .subscribe(() => {
        this.store.dispatch(EmployeesActions.removeEmailTemplate({templateId: formValue.templateId}))
        this.notifications.showSimpleInfoMessage('Successfully delete email template');
        this.templateForm.reset();
        this.emailForm.reset();
        this.router.navigate([], {queryParams: {templateId: null}, queryParamsHandling: 'merge'});
      });
  }
  public togglePreview(render: boolean): void {
    // const template = {
    //   ...this.selectedTemplate,
    //   subject: this.emailForm.value.subject,
    // };
    // if (render && !isEqual(template, this._selectedTemplate)) {
    //   const subject = this.emailForm.value.subject;
    //   const body = template[this.bodyField] || '';
    //   const afterRender = () => {
    //     this.emailForm.controls.subject.enable();
    //     this.toggleFields(render);
    //   };
    //   this.emailForm.controls.subject.disable();
    //   this.isLoading = true;
    //   this.emailService.renderEmail(this.route.snapshot.params.id, subject, body)
    //     .subscribe((renderedEmail) => {
    //       this.selectedTemplate = { ...this._selectedTemplate, ...renderedEmail };
    //       this._selectedTemplate = { ...this.selectedTemplate };
    //       this.isLoading = false;
    //       setTimeout(() => afterRender());
    //     }, () => afterRender());
    // } else {
    //   // @TODO
    //   // this.template = template;
    //   // this._template = { ...template };
    //   this.toggleFields(render);
    // }
  }
}

function employeeToEmailArray(employee: Employee): string[] {
  return [ employee.email, employee.emailAlt ].filter((e) => !!e);
}
