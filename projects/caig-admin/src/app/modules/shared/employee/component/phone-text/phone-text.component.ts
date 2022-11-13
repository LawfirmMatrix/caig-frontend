import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {AutocompleteField, FieldBase, SelectField, TextareaField} from 'dynamic-form';
import {Observable, of} from 'rxjs';
import {NotificationsService} from 'notifications';
import {map, startWith, tap} from 'rxjs/operators';
import {PhoneNumberInfo, PhoneService} from '../../../../../core/services/phone.service';
import {Employee} from '../../../../../models/employee.model';

@Component({
  selector: 'app-phone-text',
  templateUrl: './phone-text.component.html',
  styleUrls: ['./phone-text.component.scss'],
})
export class PhoneTextComponent implements OnInit {
  public form = new UntypedFormGroup({});
  public fields$!: Observable<FieldBase<any>[][]>;
  public invalidForm$ = this.form.statusChanges
    .pipe(
      map((status) => status !== 'VALID'),
      startWith(true),
    );
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PhoneTextConfig,
    public dialogRef: MatDialogRef<PhoneTextComponent>,
    private phoneService: PhoneService,
    private notificationsService: NotificationsService,
  ) {
  }

  public ngOnInit() {
    const messageTemplates: MessageTemplate[] = [
      // {
      //   id: '1',
      //   name: 'Greeting',
      //   value: 'Hello',
      // },
      // {
      //   id: '2',
      //   name: 'Alt. Greeting',
      //   value: 'Sup dude',
      // },
    ];
    const phoneNumbers = [this.data.phone, this.data.phoneWork, this.data.phoneCell].filter((n) => !!n);
    const availablePhoneNumbers$ = this.phoneService.lookup(phoneNumbers)
      .pipe(
        map((numbers) => {
          const filterFunc = this.data.tts ? filterTtsNumber : filterSmsNumbers;
          return numbers.filter(filterFunc);
        }),
        tap((numbers) => {
          if (!numbers.length) {
            this.notificationsService.showSimpleErrorMessage(`None of the phone numbers associated with this employee are capable of receiving ${this.data.tts ? 'TTS calls' : 'SMS'}`);
            this.dialogRef.close();
          }
        })
      );
    const msgBox: TextareaField = new TextareaField({
      key: 'message',
      label: 'Message',
      required: true,
      onChange: (value) => setMessageHint(value, msgBox),
    });
    setMessageHint('', msgBox);
    if (this.data.tts) {
      msgBox.validators = [Validators.minLength(40)];
    }
    this.fields$ = availablePhoneNumbers$
      .pipe(
        map((numbers) => [
          [
            new SelectField({
              key: 'phoneNumbers',
              label: 'Phone Numbers',
              itemKey: 'number',
              displayField: 'formatted',
              multiple: true,
              options: of(
                numbers.map((n) => ({...n, formatted: `${n.nationalFormat} - (${n.type ? n.type.toUpperCase() : 'UNKNOWN'})`}))
              ),
              value: numbers.length ? [numbers[0].number] : [],
            }),
          ],
          [
            new AutocompleteField<MessageTemplate>({
              key: 'messageTemplate',
              label: 'Message Template',
              disabled: true,
              itemKey: 'id',
              displayField: 'name',
              options: of(messageTemplates),
              onChange: (templateId, form) => {
                if (form.enabled) {
                  if (templateId) {
                    const template = messageTemplates.find((t) => t.id === templateId);
                    if (template) {
                      form.patchValue({message: template.value});
                    }
                  } else {
                    form.patchValue({message: ''});
                  }
                }
              }
            }),
          ],
          [ msgBox ],
        ])
      );
  }

  public send(): void {
    const value: any = this.form.value;
    const numbers: string[] = value.phoneNumbers;
    const message: string = value.message;
    this.form.disable();
    let request$: Observable<any>;
    if (this.data.tts) {
      request$ = numbers.length > 1 ?
        this.phoneService.bulkTtsCall(numbers, message) : this.phoneService.ttsCall(numbers[0], message);
    } else {
      request$ = numbers.length > 1 ?
        this.phoneService.bulkSms(numbers, message) : this.phoneService.sms(numbers[0], message);
    }
    request$.subscribe(() => {
      this.dialogRef.close();
      this.notificationsService.showSimpleInfoMessage(`${this.data.tts ? 'TTS Call placed' : 'SMS sent'} to ${this.data.name}`);
    }, () => this.form.enable());
  }
}

export interface PhoneTextConfig extends Employee {
  tts: boolean;
}

interface MessageTemplate {
  id: string;
  name: string;
  value: string;
}

function filterSmsNumbers(number: PhoneNumberInfo): boolean {
  return number.sms;
}

function filterTtsNumber(number: PhoneNumberInfo): boolean {
  return number.type !== null;
}

function setMessageHint(message: string, messageBox: TextareaField): void {
  messageBox.hint = {
    message: `${message ? message.length : 0} characters`,
    align: 'start',
  };
}
