import {CheckboxField, RadioField, SelectField} from 'dynamic-form';
import {of} from 'rxjs';
import {Validators, UntypedFormGroup} from '@angular/forms';
import {contactStep} from './shared/contact';
import {months$, years$} from './shared/date';
import {yesOrNo$} from './shared/common';
import {followUpTimes} from './shared/appointment';
import * as moment from 'moment';
import {SurveySchema} from '../../../survey/survey-data.service';

export const schema1: SurveySchema = {
  id: 1,
  name: 'NAGE VA Triage (OLD)',
  fullName: 'NAGE VA Triage',
  estCompletionTime: '1 - 2 minutes',
  steps: [
    contactStep,
    {
      title: 'Employment History',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: 'When did you begin working for the VA?',
          fields: [
            [
              new SelectField({
                key: 'startMonth',
                label: 'Month',
                required: true,
                itemKey: 'key',
                displayField: 'value',
                options: months$,
                optionDisabled: (option, form) => {
                  const month = Number(option.key) - 1;
                  const year = form.value.startYear;
                  if (month > -1 && year) {
                    const date = moment({year: Number(year), month, date: 1});
                    return date.isSameOrAfter(moment());
                  }
                  return false;
                },
                deselect: true,
              }),
              new SelectField({
                key: 'startYear',
                label: 'Year',
                required: true,
                itemKey: 'key',
                displayField: 'value',
                options: years$(75),
                deselect: true,
              }),
            ]
          ],
        },
        {
          question: 'Which type of schedule do you, or have you, worked?',
          fields: [
            [
              new CheckboxField({
                key: 'scheduleA',
                label: 'A schedule consisting of fixed start and stop times on 8, 9 or 10 days over the course of a two week pay period',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'scheduleB',
                label: 'A shift schedule consisting of shifts longer than 10 hours over the course of fewer than 8 days over a two week pay period',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'scheduleC',
                label: 'A flexible schedule that allows me to select my start and stop times on a daily basis, and use credit hours to shift hours from one day to another',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'scheduleD',
                label: 'I have only been a part time employee',
                position: 'start',
                value: false,
              }),
            ],
          ],
        },
      ],
      isValid: (value) => {
        const valid = value.scheduleA || value.scheduleB || value.scheduleC || value.scheduleD;
        return { valid, errorMessage: !valid ? 'Please select a type of schedule.' : ''}
      },
      onNext: (value) => {
        const skipToStepIndex = value.scheduleC && !value.scheduleA && !value.scheduleB && !value.scheduleD ? schema1.steps.length - 2 : undefined;
        return { skipToStepIndex };
      }
    },
    {
      title: 'Overtime Work',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: 'Going back to April 2016, have you worked more than forty hours in a week (for fixed schedule responses) or eighty hours in a pay period (for shift schedule responses)?',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'overtimeWorked',
                options: yesOrNo$,
                fxLayout: 'row',
                required: true,
              })
            ]
          ]
        },
        {
          question: 'Were you always given the choice of time-and-a-half pay for overtime worked?',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'overtimeChoice',
                options: yesOrNo$,
                fxLayout: 'row',
                required: true,
              })
            ]
          ]
        }
      ],
    },
    {
      title: 'Uncompensated Work',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: 'Did you ever, since April 2016, do any work at the VA without any form of compensation? This is typically done when coming in early, staying late, working into or through lunch, and/or coming in on a weekend, holiday or other day off.',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'uncompensatedWork',
                options: yesOrNo$,
                fxLayout: 'row',
                required: true,
              })
            ]
          ]
        },
        {
          question: '',
          fields: [
            [
              new CheckboxField({
                key: 'early',
                label: 'Early',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'late',
                label: 'Late',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'lunch',
                label: 'Lunch',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'weekends',
                label: 'Weekends',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'holidays',
                label: 'Holidays',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'offDays',
                label: 'Off days',
                position: 'start',
                value: false,
              }),
            ],
          ]
        }
      ],
      isValid: (value) => {
        const valid = !value.uncompensatedWork || (value.early || value.late || value.lunch || value.weekends || value.holidays || value.offDays);
        return { valid };
      },
      onChange: (value) => {
        return {
          modifyQuestions: [
            {
              stepIndex: 3,
              questionIndex: 1,
              modifiedQuestion: value.uncompensatedWork ? 'Please select those that apply:' : '',
            },
            {
              stepIndex: 5,
              questionIndex: 0,
              modifiedQuestion: value.uncompensatedWork || value.homeWork ? 'Is there a way your supervisor is aware that you were doing this?' : '',
            },
            {
              stepIndex: 5,
              questionIndex: 1,
              modifiedQuestion: value.uncompensatedWork || value.homeWork ? 'Does this happen regularly?' : '',
            },
          ],
        };
      },
    },
    {
      title: 'Home Work',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: 'Did you ever, since April 2016, perform any work for the VA at home when not in telework status (including receiving or making work phone calls and reading or sending work emails)?',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'homeWork',
                options: yesOrNo$,
                fxLayout: 'row',
                required: true,
              })
            ]
          ]
        }
      ],
      onNext: (value) => {
        return {
          skipToStepIndex: !value.uncompensatedWork && !value.homeWork ? 6 : undefined,
        };
      },
      onChange: (value) => {
        return {
          modifyQuestions: [
            {
              stepIndex: 5,
              questionIndex: 0,
              modifiedQuestion: value.uncompensatedWork || value.homeWork ? 'Is there a way your supervisor is aware that you were doing this?' : '',
            },
            {
              stepIndex: 5,
              questionIndex: 1,
              modifiedQuestion: value.uncompensatedWork || value.homeWork ? 'Does this happen regularly?' : '',
            },
          ],
        };
      }
    },
    {
      title: 'Supervisor Awareness',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: '',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'supervisorAwareness',
                required: true,
                options: of([
                  { key: 'a', value: 'My supervisor(s) knew' },
                  { key: 'b', value: 'My supervisor(s) had a way of knowing' },
                  { key: 'c', value: 'I am unsure if my supervisor(s) knew' },
                  { key: 'd', value: 'My supervisor(s) had no way of knowing' },
                ]),
                fxLayout: 'column',
              })
            ]
          ],
        },
        {
          question: '',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'frequency',
                required: true,
                options: of([
                  { key: 'a', value: 'Regularly (i.e., multiple times per month)' },
                  { key: 'b', value: 'Irregularly (i.e., several times per year)' },
                  { key: 'c', value: 'Rarely' },
                ]),
                fxLayout: 'column',
              })
            ]
          ],
        }
      ],
    },
    {
      title: 'Travel Work',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: 'Have you travelled since April 2016 on behalf of the VA (such as for TDY or training) without receiving compensation?',
          fields: [
            [
              new RadioField({
                label: '',
                key: 'travelWork',
                required: true,
                options: yesOrNo$,
                fxLayout: 'row',
              })
            ]
          ]
        },
      ],
    },
    {
      title: 'Follow-Up',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: `Are you available to receive follow-up contact from the Union's law firm to supply more details?`,
          fields: [
            [
              new RadioField({
                label: '',
                key: 'followUp',
                required: true,
                options: of([
                  {key: 'yes', value: `Yes, I'm available anytime during normal business hours`},
                  {key: true, value: `Yes, I'm available at the following times...`},
                  {key: false, value: 'No'}
                ]),
                fxLayout: 'column',
                onChange: (value, form) => {
                  const month = form.controls['month1'];
                  const day = form.controls['day1'];
                  const time = form.controls['time1'];
                  if (month && day && time) {
                    if (value === true) {
                      month.setValidators(Validators.required);
                      day.setValidators(Validators.required);
                      time.setValidators(Validators.required);
                    } else {
                      month.clearValidators();
                      day.clearValidators();
                      time.clearValidators();
                    }
                    form.reset({followUp: value, ppeSurvey: form.value.ppeSurvey}, {emitEvent: false});
                  }
                }
              })
            ]
          ]
        },
        followUpTimes,
        {
          question: 'Would you like to participate in the COVID-19 Hazard Pay Survey?',
          fields: [
            [
              new RadioField({
                key: 'ppeSurvey',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ]
        }
      ],
      onChange: (value) => {
        return {
          modifyQuestions: [
            {
              stepIndex: 7,
              questionIndex: 1,
              modifiedQuestion: value.followUp === true ? `Select up to 2 dates/times when you'll be available` : '',
            },
          ],
        };
      },
    },
  ],
};
