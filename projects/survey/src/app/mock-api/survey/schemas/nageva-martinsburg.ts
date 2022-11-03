import {CheckboxField, DateField, RadioField, SelectField} from 'dynamic-form';
import {Validators} from '@angular/forms';
import {nageVa} from './unions/nage-va';
import {contactStep} from './shared/contact';
import {months$, years$} from './shared/date';
import {startBeforeDate$, yesOrNo$} from './shared/common';
import {
  apptMonths$,
  days$,
  disableDay,
  disableMonth,
  followUpTimes,
  onDayChange,
  onMonthChange,
  times$
} from './shared/appointment';
import {Subject} from 'rxjs';
import {SurveySchema} from '../../../survey/survey.service';

const month3Change$ = new Subject<string>();

export const schema2: SurveySchema = {
  id: 2,
  ...nageVa,
  name: 'NAGE VA - FLSA Overtime Survey',
  fullName: 'NAGE VA - FLSA Overtime Survey',
  location: 'Martinsburg',
  estCompletionTime: '1 - 2 minutes',
  headerContent: [
    'Your Union filed a Grievance because the VA has not properly compensated employees for overtime work. This likely includes you! We are now gathering information to determine which employees are owed back pay. Overtime work includes work performed at any time outside of your regularly scheduled hours – such as early and late work, work during lunch and work on off days. Work even includes things like checking or responding to work emails or taking work phone calls while off.',
  ],
  steps: [
    contactStep,
    {
      title: 'Employment History',
      questions: [
        {
          question: 'Did you begin working for the VA before April 2016?',
          invalid: (value) => value.startBeforeDate === undefined,
          fields: [
            [
              new RadioField({
                key: 'startBeforeDate',
                label: '',
                options: startBeforeDate$,
                required: true,
                fxLayout: 'row',
                onChange: (value, form) => {
                  const month = form.controls['startMonth'];
                  const year = form.controls['startYear'];
                  if (month && year) {
                    if (value === false) {
                      month.setValidators(Validators.required);
                      year.setValidators(Validators.required);
                    } else {
                      month.clearValidators();
                      year.clearValidators();
                    }
                    form.reset({
                      startBeforeDate: value,
                      scheduleC: !!form.value.scheduleC,
                      scheduleE: !!form.value.scheduleE,
                    }, {emitEvent: false});
                  }
                }
              }),
            ]
          ],
        },
        {
          question: '',
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
                  const num = Number(option.key);
                  return form.value.startYear === '2016' && num > 0 && num < 4;
                },
                deselect: true,
              }),
              new SelectField({
                key: 'startYear',
                label: 'Year',
                required: true,
                itemKey: 'key',
                displayField: 'value',
                options: years$(7),
                onChange: (value, form) => {
                  const month = form.controls['startMonth'];
                  const num = Number(month.value);
                  if (value === '2016' && num > 0 && num < 4) {
                    month.reset(undefined, {emitEvent: false});
                  }
                },
                deselect: true,
              }),
            ]
          ],
        },
        {
          question: 'Which full time schedule(s) have you ever worked at the VA? Select all that apply:',
          invalid: (value) => value.scheduleC === undefined && value.scheduleE === undefined,
          fields: [
            [
              new CheckboxField({
                key: 'scheduleC',
                label: 'A flexible schedule that allows you to alter your start and/or stop times and use credit hours to shift work time from one day to another.',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'scheduleE',
                label: 'Any other schedule, such as a fixed schedule, shift schedule or compressed schedule.',
                position: 'start',
                value: false,
              }),
            ],
          ],
        }
      ],
      onChange: (value) => {
        return {
          modifyQuestions: [
            {
              stepIndex: 1,
              questionIndex: 1,
              modifiedQuestion: value.startBeforeDate === false ? 'Please indicate when you began:' : '',
            },
          ],
        };
      },
      isValid: (value) => {
        const valid = value.scheduleC || value.scheduleE;
        return { valid, errorMessage: !value.startBeforeDate && value.startBeforeDate !== false ? 'Please choose when you began working for the VA.' : !valid ? 'Please select a work schedule.' : '' };
      },
    },
    {
      title: 'Overtime Work',
      headings: [
        {
          text: 'Since April 2016, have you ever:'
        }
      ],
      questions: [
        {
          question: 'Started working early before your scheduled work day and not received overtime pay for that work?',
          invalid: (value) => value.early === undefined,
          fields: [
            [
              new RadioField({
                key: 'early',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Stayed late working past your scheduled work day and not received overtime pay for that work?',
          invalid: (value) => value.late === undefined,
          fields: [
            [
              new RadioField({
                key: 'late',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Worked during your lunch break without receiving overtime pay for that work?',
          invalid: (value) => value.lunch === undefined,
          fields: [
            [
              new RadioField({
                key: 'lunch',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Worked on an off-day without receiving overtime pay for that work?',
          invalid: (value) => value.offDays === undefined,
          fields: [
            [
              new RadioField({
                key: 'offDays',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Performed work at home without receiving overtime pay for that work?',
          invalid: (value) => value.homeWork === undefined,
          fields: [
            [
              new RadioField({
                key: 'homeWork',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Traveled for work on off-time without receiving overtime pay for that work?',
          invalid: (value) => value.travelWork === undefined,
          fields: [
            [
              new RadioField({
                key: 'travelWork',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Been forced to accept compensatory time (“comp time”) instead of overtime pay for any overtime work?',
          invalid: (value) => value.compTime === undefined,
          fields: [
            [
              new RadioField({
                key: 'compTime',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
      ],
    },
    {
      title: 'Follow-Up',
      headings: [
        {
          text: 'You may be contacted for more information. Please indicate three dates and times when it would be best to reach you.',
        },
        {
          text: '(Monday through Thursday, 8:30am - 6:00pm)',
          italic: true,
        }
      ],
      questions: [
        {
          question: ' ',
          fields: [
            [
              new CheckboxField({
                key: 'followUpAnytime',
                label: 'Contact me any time during the above days/times',
                position: 'start',
                onChange: (value, form) => {
                  if (value) {
                    form.disable({emitEvent: false});
                    form.controls['followUp'].enable({emitEvent: false});
                    form.controls['followUpAnytime'].enable({emitEvent: false});
                    form.controls['ppeSurvey'].enable({emitEvent: false});
                  } else {
                    form.enable({emitEvent: false});
                  }
                },
                value: false,
              }),
              new CheckboxField({
                hide: true,
                key: 'followUp',
                label: '',
                value: true,
              }),
            ],
            ...followUpTimes.fields.map((r) => r.map((f) => ({...f, required: true}))),
            [
              new DateField({
                key: 'date3',
                label: 'Date #3',
                hide: true,
              }),
              new SelectField({
                key: 'month3',
                label: 'Month',
                itemKey: 'key',
                displayField: 'value',
                options: apptMonths$,
                optionDisabled: disableMonth,
                onChange: onMonthChange('date3', 'day3', month3Change$),
                deselect: true,
                required: true
              }),
              new SelectField({
                key: 'day3',
                label: 'Day',
                itemKey: 'key',
                displayField: 'value',
                options: days$(month3Change$),
                optionDisabled: disableDay('month3'),
                onChange: onDayChange('date3', 'month3'),
                deselect: true,
                required: true,
              }),
              new SelectField({
                key: 'time3',
                label: 'Time #3',
                fxFlex: 50,
                options: times$,
                itemKey: 'key',
                displayField: 'value',
                deselect: true,
                required: true
              }),
            ]
          ]
        },
        {
          question: 'Would you like information on how to participate in the COVID-19 Hazard Pay Survey?',
          invalid: (value) => value.ppeSurvey === undefined,
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
    },
  ],
};
