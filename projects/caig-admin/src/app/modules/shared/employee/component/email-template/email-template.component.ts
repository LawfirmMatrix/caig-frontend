import {Component, OnInit} from '@angular/core';
import {ToolbarButton} from '../toolbar-buttons/toolbar-buttons.component';
import {ActivatedRoute, Router} from '@angular/router';
import {EmailService, EmailTemplate, EmployeeEmailTemplate} from '../../../../../core/services/email.service';
import {filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {InputField} from 'dynamic-form';
import {FormGroup, FormControl} from '@angular/forms';
import {isEqual} from 'lodash-es';
import {NotificationsService} from 'notifications';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/reducers';
import {EmployeesActions} from '../../store/actions/action-types';

@Component({
  selector: 'app-email-template',
  templateUrl: './email-template.component.html',
  styleUrls: ['./email-template.component.scss']
})
export class EmailTemplateComponent implements OnInit {
  private _template: Partial<EmployeeEmailTemplate> = {};
  private reroute = (this.route.snapshot.params as any).templateId ? '../../' : '../';
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'Compose Email',
      icon: 'chevron_left',
      routerLink: this.reroute,
    }
  ];
  public template: Partial<EmployeeEmailTemplate> = {};
  public isLoading = !!(this.route.snapshot.params as any).templateId;
  public fields = [
    [
      new InputField({
        key: 'title',
        label: 'Title',
        required: true,
      })
    ],
    [
      new InputField({
        key: 'subject',
        label: 'Subject',
        required: true,
      })
    ]
  ];
  public form = new FormGroup<{subject?: FormControl<string>}>({});
  public invalidForm$ = this.form.statusChanges
    .pipe(
      map((status) => status !== 'VALID'),
      startWith(this.form.invalid),
    );
  public bodyField: 'body' | 'bodyRendered' = 'body';
  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private dataService: EmailService,
    private notifications: NotificationsService,
    private store: Store<AppState>,
  ) { }
  public ngOnInit() {
    this.route.params
      .pipe(
        filter((params: any) => !!params.templateId),
        tap(() => this.isLoading = true),
        switchMap((params) => this.dataService.getEmployeeTemplate(params.templateId, params.id))
      )
      .subscribe((template) => {
        this.template = template;
        this._template = {...template};
        this.isLoading = false;
      }, () => this.isLoading = false);
  }
  public save(): void {
    const template: Partial<EmailTemplate> = {
      ...this.template,
      ...this.form.value,
    };
    this.isLoading = true;
    this.dataService.saveTemplate(template)
      .subscribe((res) => {
        if (!template.id) {
          this.store.dispatch(EmployeesActions.addEmailTemplate({template: res}));
        } else {
          this.store.dispatch(EmployeesActions.updateEmailTemplate({template: res}));
        }
        this.notifications.showSimpleInfoMessage(`Successfully ${template.id ? 'updated' : 'created'} email template`);
        this.router.navigate([this.reroute], {queryParamsHandling: 'preserve', relativeTo: this.route});
      }, () => this.isLoading = false);
  }
  public togglePreview(render: boolean): void {
    const template = {
      ...this.template,
      ...this.form.value,
    };
    if (render && !isEqual(template, this._template)) {
      const subject = this.form.value.subject || '';
      const body = template[this.bodyField] || '';
      const afterRender = () => {
        this.form.controls.subject?.enable();
        this.toggleFields(render);
      };
      this.form.controls.subject?.disable();
      this.isLoading = true;
      this.dataService.renderEmail((this.route.snapshot.params as any).id, subject, body)
        .subscribe((renderedEmail) => {
          this.template = { ...this._template, ...renderedEmail };
          this._template = { ...this.template };
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
  public insertPlaceholder(field: string): void {
    this.form.patchValue({subject: `${this.form.value.subject || ''}{{${field}}} `});
  }
  private toggleFields(render: boolean): void {
    this.bodyField = render ? 'bodyRendered' : 'body';
    this.form.patchValue({subject: this.template[render ? 'subjectRendered' : 'subject']});
  }
}
