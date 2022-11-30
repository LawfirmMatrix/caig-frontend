import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-email-editor',
  templateUrl: './email-editor.component.html',
  styleUrls: ['./email-editor.component.scss'],
})
export class EmailEditorComponent implements OnInit {
  public subjectForm = new UntypedFormGroup({});
  public eventForm = new UntypedFormGroup({});
  public subjectFields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
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
          this.sidenavService.open({});
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
  constructor(
    private store: Store<AppState>,
    private sidenavService: SidenavStackService,
  ) {
  }
  public ngOnInit() {

  }
}
