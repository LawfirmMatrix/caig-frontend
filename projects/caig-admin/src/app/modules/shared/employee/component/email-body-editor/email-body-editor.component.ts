import {Component, EventEmitter, Input, Output} from '@angular/core';
import Quill from 'quill';
import {filter, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../../store/reducers';
import {fields} from '../../store/selectors/employees.selectors';
import {EmployeesActions} from '../../store/actions/action-types';
import {isNotUndefined} from '../../../../../core/util/functions';

@Component({
  selector: 'app-email-body-editor',
  templateUrl: './email-body-editor.component.html',
  styleUrls: ['./email-body-editor.component.scss']
})
export class EmailBodyEditorComponent {
  @Input() public template!: { body?: string, bodyRendered?: string };
  @Input() public field!: 'body' | 'bodyRendered';
  @Input() public disablePlaceholders!: boolean;
  @Input() public disableEditor!: boolean;
  @Output() public placeholderClick = new EventEmitter<string>();
  public fields$ = this.store.select(fields)
    .pipe(
      tap((fields) => {
        if (!fields) {
          this.store.dispatch(EmployeesActions.loadFields());
        }
      }),
      filter(isNotUndefined),
    )
  public editor!: Quill;
  public isFocused!: boolean;
  constructor(private store: Store<AppState>) { }
  public insertPlaceholder(field: string): void {
    if (this.isFocused) {
      const selection = this.editor.getSelection(true);
      const placeholder = `{{${field}}} `;
      this.editor.insertText(selection.index, placeholder, 'user');
      this.editor.setSelection({index: selection.index + placeholder.length, length: 0}, 'user');
    } else {
      this.placeholderClick.emit(field);
    }
  }
}
