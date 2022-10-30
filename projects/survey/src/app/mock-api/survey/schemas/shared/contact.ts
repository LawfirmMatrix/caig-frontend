import {CheckboxField, InputField, PhoneNumberField} from 'dynamic-form';
import {Validators} from '@angular/forms';
import {SurveyStep} from '../../../../survey/survey.service';

export const contactStep: SurveyStep = {
  title: 'Contact Information',
  questions: [
    {
      question: 'Please provide your name, telephone number, and email address:',
      fields: [
        [
          new InputField({
            key: 'firstName',
            label: 'First Name',
            type: 'text',
            required: true,
          }),
          new InputField({
            key: 'middleName',
            label: 'Middle Name/Initial',
            type: 'text',
          }),
          new InputField({
            key: 'lastName',
            label: 'Last Name',
            type: 'text',
            required: true,
          }),
        ],
        [
          new PhoneNumberField({
            key: 'phoneCell',
            label: 'Cell Phone',
            position: 'start',
            required: true,
          }),
          new CheckboxField({
            key: 'sms',
            label: 'I can receive text messages',
            position: 'start',
          }),
        ],
        [
          new PhoneNumberField({
            key: 'phoneWork',
            label: 'Work Phone',
            position: 'start',
            extension: true,
          }),
          new PhoneNumberField({
            key: 'phoneHome',
            label: 'Home Phone',
            position: 'start',
            fxFlex: 100,
          }),
        ],
        [
          new InputField({
            type: 'email',
            key: 'email',
            label: 'Email',
            validators: [Validators.email],
            required: true,
            onChange: (value, form) => {
              const key = 'altEmail';
              if (value) {
                form.controls[key].enable({emitEvent: false});
              } else {
                form.controls[key].disable({emitEvent: false});
              }
            }
          }),
          new InputField({
            type: 'email',
            key: 'altEmail',
            label: 'Alt. Email',
            validators: [Validators.email],
            disabled: true,
          })
        ],
        [
          new CheckboxField({
            key: 'currentBue',
            label: 'I am currently a Bargaining Unit Employee',
            position: 'start',
          }),
        ],
        [
          new CheckboxField({
            key: 'retired',
            label: 'I am retired',
            position: 'start',
          })
        ]
      ],
    }
  ],
};
