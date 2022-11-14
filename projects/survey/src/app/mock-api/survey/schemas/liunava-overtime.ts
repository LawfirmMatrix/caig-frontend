import {CheckboxField, DateField, RadioField, SelectField} from 'dynamic-form';
import {Validators} from '@angular/forms';
import {contactStep} from './shared/contact';
import {months$, years$, nextDay, currentDay, currentYear, currentMonth} from './shared/date';
import {startBeforeDate$, yesOrNo$} from './shared/common';
import {followUpTimes, times$, filterDate, maxDate} from './shared/appointment';
import {liunaVa} from './unions/liuna-va';
import {SurveySchemaBase} from '../../../survey/survey-data.service';

export const schema4: SurveySchemaBase = {
  ...liunaVa,
  name: 'LIUNA 1029 VA - FLSA Overtime Survey',
  fullName: 'LIUNA 1029 VA - FLSA Overtime Survey',
  estCompletionTime: '1 - 2 minutes',
  headerContent: '<p>Your Union filed a Grievance because the VA has not properly compensated employees for overtime work, as far back as 2007 and up to the present. This likely includes you! The Arbitrator in this case has already started issuing substantial backpay awards and we are now gathering information to determine which other employees are owed back pay and how much. Overtime work includes work performed at any time outside of your regularly scheduled hours – such as early and late work, work during lunch and work on off days. Work even includes things like checking or responding to work emails or taking work phone calls while off.</p>',
  steps: [
    contactStep,
    {
      title: 'Employment History',
      questions: [
        {
          question: 'Did you begin working for the Wilmington VA before September 2007?',
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
                  const startYear = Number(form.value.startYear);
                  return startYear === 2007 && num > 0 && num < 9 || startYear === currentYear && num > currentMonth + 1;
                },
                deselect: true,
              }),
              new SelectField({
                key: 'startYear',
                label: 'Year',
                required: true,
                itemKey: 'key',
                displayField: 'value',
                options: years$(2007),
                onChange: (value, form) => {
                  const month = form.controls['startMonth'];
                  const num = Number(month.value);
                  if (value === '2007' && num > 0 && num < 9) {
                    month.reset(undefined, {emitEvent: false});
                  }
                },
                deselect: true,
              }),
            ]
          ],
        },
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
    },
    {
      title: 'Overtime Work',
      heading: 'Since September 2007, have you ever:',
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
      heading: `
        <div>You may be contacted for more information. If you are not generally available anytime, please indicate up to three dates and times when it would be best to reach you.</div>
        <div><i>(Monday through Thursday, 8:30am - 6:00pm)</i></div>
      `,
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
                required: true,
                dateFilter: filterDate,
                min: nextDay,
                max: maxDate,
                openButton: true,
              }),
              new SelectField({
                key: 'time3',
                label: 'Time #3',
                fxFlex: 50,
                required: true,
                options: times$,
                itemKey: 'key',
                displayField: 'value',
                deselect: true,
              }),
            ]
          ]
        },
      ],
    },
  ],
};
