import Quill from 'quill';
import {UntypedFormGroup} from '@angular/forms';
import {InputField, FieldBase} from 'dynamic-form';

export abstract class EmailEditor {
  private static readonly SUBJECT_INPUT_ID_NAME = 'subjectInput';
  private static SUBJECT_INPUT_ID = 0;
  public quillEditorFocused = false;
  public emailBody = '';
  public quillEditor: Quill | undefined;
  public subjectForm = new UntypedFormGroup({});
  public abstract subjectFields: FieldBase<any>[][];
  protected subjectField = new InputField({
    key: 'subject',
    label: 'Subject',
    type: 'text',
    required: true,
    id: EmailEditor.SUBJECT_INPUT_ID_NAME + EmailEditor.SUBJECT_INPUT_ID++,
    appearance: 'standard',
  });
  constructor(protected document: Document) { }
  public insertTag(tag: string): void {
    const placeholder = `{{${tag}}} `;
    if (this.quillEditorFocused) {
      if (this.quillEditor) {
        const selection = this.quillEditor.getSelection(true);
        this.quillEditor.insertText(selection.index, placeholder, 'user');
        this.quillEditor.setSelection({index: selection.index + placeholder.length, length: 0}, 'user');
      }
    } else {
      const inputEl = this.document.getElementById(this.subjectField.id) as HTMLInputElement;
      const selectionStart = inputEl.selectionStart || 0;
      const selectionOffset = selectionStart + placeholder.length;
      const subject = selectionStart < inputEl.value.length - 1 ?
        `${inputEl.value.slice(0, selectionStart)}${placeholder}${inputEl.value.slice(selectionStart)}` :
        `${inputEl.value}${placeholder}`;
      this.subjectForm.patchValue({subject});
      inputEl.focus();
      inputEl.setSelectionRange(selectionOffset, selectionOffset);
    }
  }
}
