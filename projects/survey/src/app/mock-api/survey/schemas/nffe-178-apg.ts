import {SurveySchema} from '../../../survey/survey-data.service';
import {nffeApg} from './unions/nffe-apg';
import {contactStep} from './shared/contact';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {RadioField, SelectField, CheckboxField, DateField} from 'dynamic-form';
import {startBeforeDate$, yesOrNo$} from './shared/common';
import {months$, years$, nextDay} from './shared/date';
import {followUpTimes, filterDate, maxDate, times$} from './shared/appointment';

export const schema5: SurveySchema = {
  id: 0,
  ...nffeApg,
  name: 'NFFE 178 APG',
  fullName: 'NFFE 178 APG - FLSA Overtime Survey',
  location: 'Maryland',
  estCompletionTime: '1 - 2 minutes',
  headerContent: `
    <p>Your Union filed a Grievance because APG has not properly compensated employees for overtime work, as far back as 2006 and up to 2022. Many employees worked at times for which they should have been paid overtime but were not. This likely includes you!</p>
    <p>We have already recovered a substantial amount of back pay compensation for a portion of those covered and we are now gathering information to determine which other employees are owed back pay and how much. <b>Overtime work includes work performed at any time outside your regularly scheduled hours</b> &mdash; such as early and late work, work during lunch and work on off days. Work even includes things like checking or responding to work emails or taking work phone calls while off.</p>
  `,
  steps: [
    contactStep,
    {
      title: 'Employment',
      form: new UntypedFormGroup({}),
      questions: [
        {
          question: 'Did you begin working for APG before February 2006?',
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
                    form.reset({startBeforeDate: value}, {emitEvent: false});
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
                  return form.value.startYear === '2006' && num > 0 && num < 2;
                },
                deselect: true,
              }),
              new SelectField({
                key: 'startYear',
                label: 'Year',
                required: true,
                itemKey: 'key',
                displayField: 'value',
                options: years$(2006),
                onChange: (value, form) => {
                  const month = form.controls['startMonth'];
                  const num = Number(month.value);
                  if (value === '2006' && num > 0 && num < 2) {
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
      form: new UntypedFormGroup({}),
      heading: 'Since February 2006, have you ever:',
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
      form: new UntypedFormGroup({}),
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
}
