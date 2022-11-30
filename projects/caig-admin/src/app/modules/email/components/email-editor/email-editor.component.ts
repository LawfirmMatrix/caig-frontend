import {Component, Input, Inject} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {filter, tap} from 'rxjs';
import {isNotUndefined} from '../../../../core/util/functions';
import {FieldBase, InputField, AutocompleteField, CheckboxField} from 'dynamic-form';
import {UntypedFormGroup} from '@angular/forms';
import {emailTemplates} from '../../store/selectors/email.selectors';
import {EmailActions} from '../../store/actions/action-types';
import {eventTypes} from '../../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../../enums/store/actions/action-types';
import {SidenavStackService} from 'sidenav-stack';
import {TemplateEditorComponent} from '../template-editor/template-editor.component';
import {EmailTemplate, EmailService} from '../../../../core/services/email.service';
import Quill from 'quill';
import {DOCUMENT} from '@angular/common';
import {LoadingService} from '../../../../core/services/loading.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss'],
})
export class EmailEditorComponent {
  private static readonly SUBJECT_ID = 'subjectInput';
  @Input() public addressForm!: UntypedFormGroup;
  public subjectForm = new UntypedFormGroup({});
  public eventForm = new UntypedFormGroup({});
  public subjectFields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        id: EmailEditorComponent.SUBJECT_ID,
      }),
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
        onAddItem: () => {
          this.sidenavService.open<EmailTemplate>('New Template', TemplateEditorComponent).subscribe((template) => {
            this.subjectForm.patchValue({templateId: template.id});
          })
        },
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
  public quillEditor: Quill | undefined;
  public quillEditorFocused = false;
  public emailBody = '';
  constructor(
    private store: Store<AppState>,
    private sidenavService: SidenavStackService,
    @Inject(DOCUMENT) private document: Document,
  ) {
  }
  public insertTag(tag: string): void {
    const placeholder = `{{${tag}}} `;
    if (this.quillEditorFocused) {
      if (this.quillEditor) {
        const selection = this.quillEditor.getSelection(true);
        this.quillEditor.insertText(selection.index, placeholder, 'user');
        this.quillEditor.setSelection({index: selection.index + placeholder.length, length: 0}, 'user');
      }
    } else {
      const inputEl = this.document.getElementById(EmailEditorComponent.SUBJECT_ID) as HTMLInputElement;
      const selectionStart = inputEl.selectionStart || 0;
      const selectionOffset = selectionStart + placeholder.length;
      const subject = selectionStart < inputEl.value.length - 1 ?
        `${inputEl.value.slice(0, selectionStart)}${placeholder}${inputEl.value.slice(selectionStart)}` :
        `${inputEl.value}${placeholder}`;
      this.subjectForm.patchValue({ subject });
      inputEl.focus();
      inputEl.setSelectionRange(selectionOffset, selectionOffset);
    }
  }
}
