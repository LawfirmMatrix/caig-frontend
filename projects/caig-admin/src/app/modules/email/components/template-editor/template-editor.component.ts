import {Component, Output, EventEmitter, Inject, OnInit, Input} from '@angular/core';
import {SidenavComponent, SidenavComponentMessage, MenuMessage, ProcessingMessage, CloseMessage} from 'sidenav-stack';
import {FieldBase, InputField} from 'dynamic-form';
import {EmailEditor} from '../email-editor';
import {DOCUMENT} from '@angular/common';
import {saveMenuButton} from '../../../../core/util/consts';
import {combineLatest, BehaviorSubject} from 'rxjs';
import {EmailService, EmailTemplate} from '../../../../core/services/email.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {NotificationsService} from 'notifications';
import {EmailActions} from '../../store/actions/action-types';

@Component({
  selector: 'app-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss']
})
export class TemplateEditorComponent extends EmailEditor implements SidenavComponent, OnInit {
  @Output() public controlMsg = new EventEmitter<SidenavComponentMessage>(true);
  @Input() public templateId: string | undefined;
  @Input() public employeeId: string | undefined;
  public subjectFields: FieldBase<any>[][] = [
    [
      this.subjectField,
      new InputField({
        key: 'title',
        label: 'Template Name',
        required: true,
        fxFlex: 0,
      }),
    ]
  ];
  public emailBodyChange$ = new BehaviorSubject<void>(void 0);
  constructor(
    @Inject(DOCUMENT) protected override document: Document,
    private emailService: EmailService,
    private store: Store<AppState>,
    private notifications: NotificationsService,
  ) {
    super(document);
  }
  public ngOnInit() {
    if (this.templateId && this.employeeId) {
      this.controlMsg.emit(new ProcessingMessage(true));
      this.emailService.getEmployeeTemplate(this.templateId, this.employeeId)
        .subscribe((model) => {
          this.controlMsg.emit(new ProcessingMessage(false));
          this.emailBody = model.body;
          this.subjectForm.patchValue(model);
        }, () => this.controlMsg.emit(new ProcessingMessage(false)));
    }

    const saveBtn = saveMenuButton(() => this.save(), true);
    const menu = [saveBtn];
    this.controlMsg.emit(new MenuMessage(menu));
    combineLatest([this.emailBodyChange$, this.subjectForm.statusChanges])
      .subscribe(([, status]) => {
        saveBtn.disabled = !this.emailBody || status !== 'VALID';
        this.controlMsg.emit(new MenuMessage(menu));
      });
  }
  private save(): void {
    const template: Partial<EmailTemplate> = {
      ...this.subjectForm.value,
      body: this.emailBody,
      id: this.templateId,
    };
    this.controlMsg.emit(new ProcessingMessage(true));
    this.emailService.saveTemplate(template).subscribe((res) => {
      if (!template.id) {
        this.store.dispatch(EmailActions.addEmailTemplate({template: res}));
      } else {
        this.store.dispatch(EmailActions.updateEmailTemplate({template: res}));
      }
      this.controlMsg.emit(new CloseMessage(res));
      this.notifications.showSimpleInfoMessage(`Successfully ${template.id ? 'updated' : 'created'} email template`);
    }, () => this.controlMsg.emit(new ProcessingMessage(false)));
  }
}
