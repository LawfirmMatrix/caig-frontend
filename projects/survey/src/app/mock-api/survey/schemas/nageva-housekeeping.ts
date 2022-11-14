import {CheckboxField, InputField, RadioField, SelectField, TextareaField} from 'dynamic-form';
import * as moment from 'moment';
import {of} from 'rxjs';
import {nageVa} from './unions/nage-va';
import {contactStep} from './shared/contact';
import {months$, years$, currentDay} from './shared/date';
import {yesOrNo$} from './shared/common';
import {SurveySchemaBase} from '../../../survey/survey-data.service';

export const protectiveEquipmentOptions = [
  { key: 'a', value: 'Yes, it is required.' },
  { key: 'b', value: 'Yes, it is optional.' },
  { key: 'c', value: `No, and I don't want to.` },
  { key: 'd', value: 'No, but I have requested it and it was not provided.' },
];

export const hazardTrainingOptions = [
  { key: 'a', value: 'Yes, one time.' },
  { key: 'b', value: 'Yes, at least one time a year.' },
  { key: 'c', value: 'No' },
];

export const schema3: SurveySchemaBase = {
  ...nageVa,
  name: 'NAGE VA HOUSEKEEPING',
  fullName: 'NAGE – Housekeeping/Laborer Hazard Pay Survey',
  estCompletionTime: '1 - 2 minutes',
  headerTitle: 'THIS IS NOT A SURVEY FOR HAZARD PAY RELATED TO COVID-19 EXPOSURE. THIS SURVEY IS ABOUT HAZARDS FROM MEDICAL WASTE ONLY.',
  headerContent: `
    <p>Employees of the U.S Department of Veterans Affairs (“VA”) whose work causes them to be in contact with, or close to hazardous medical materials (for example, blood, urine, feces, needles, syringes, etc.) may be entitled to receive additional pay. Depending on the severity of the contact and the position of record, a VA employee may be entitled to an additional percentage of pay for every day in which the employee was in contact with or close to hazardous material.</p>
    <p>We have become aware that Housekeeping Aides and other Laborers at numerous VA facilities often come into contact with, or work close to hazardous medical materials without receiving this extra hazard pay. As such, the Union is investigating whether a grievance seeking this extra pay is appropriate.</p>
    <p>Your response to this survey will help us determine whether there is a likely entitlement to extra hazard pay. If you deal with hazardous materials (for example, blood, urine, feces, needles, syringes, other medical waste, etc.) your response is critical.</p>
  `,
  steps: [
    contactStep,
    {
      title: 'Employment',
      questions: [
        {
          question: 'Name and location (city and state) of the VA facility at which you are employed:',
          fields: [
            [
              new InputField({
                type: 'text',
                label: 'Facility Name',
                key: 'facilityName',
                required: true,
              })
            ],
            [
              new InputField({
                type: 'text',
                label: 'Facility City',
                key: 'facilityCity',
                required: true,
              }),
              new InputField({
                type: 'text',
                label: 'Facility State',
                key: 'facilityState',
                required: true,
              })
            ],
          ],
        },
        {
          question: 'Position Title, Grade and Series:',
          fields: [
            [
              new InputField({
                type: 'text',
                label: 'Position Title',
                key: 'positionTitle',
                required: true,
              })
            ],
            [
              new InputField({
                type: 'number',
                label: 'Grade',
                key: 'grade',
                required: true,
                fxFlex: 10,
              })
            ],
            [
              new InputField({
                type: 'number',
                label: 'Series',
                key: 'series',
                fxFlex: 10,
              })
            ],
          ]
        },
        {
          question: 'Start Date in Position:',
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
                    return date.isSameOrAfter(currentDay);
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
                options: years$(1950),
                onChange: (value, form) => {
                  const month = form.value.startMonth ? Number(form.value.startMonth) - 1 : -1;
                  if (month > -1 && value) {
                    const date = moment({year: Number(value), month, date: 1});
                    if (date.isSameOrAfter(moment())) {
                      form.patchValue({startMonth: undefined}, {emitEvent: false});
                    }
                  }
                },
                deselect: true,
              }),
            ]
          ]
        },
        {
          question: 'End Date in Position (if applicable):',
          fields: [
            [
              new SelectField({
                key: 'endMonth',
                label: 'Month',
                itemKey: 'key',
                displayField: 'value',
                options: months$,
                deselect: true,
                optionDisabled: (option, form) => {
                  const month = Number(option.key) - 1;
                  const year = form.value.endYear;
                  if (month > -1 && year) {
                    const date = moment({year: Number(year), month, date: 1});
                    return date.isSameOrAfter(currentDay);
                  }
                  return false;
                },
              }),
              new SelectField({
                key: 'endYear',
                label: 'Year',
                itemKey: 'key',
                displayField: 'value',
                options: years$(1950),
                deselect: true,
                onChange: (value, form) => {
                  const month = form.value.endMonth ? Number(form.value.endMonth) - 1 : -1;
                  if (month > -1 && value) {
                    const date = moment({year: Number(value), month, date: 1});
                    if (date.isSameOrAfter(moment())) {
                      form.patchValue({endMonth: undefined}, {emitEvent: false});
                    }
                  }
                },
              }),
            ]
          ]
        }
      ],
    },
    {
      title: 'Hazardous Work',
      questions: [
        {
          question: 'Have you ever received any extra pay for hazardous work (examples may be called: Hazardous Duty Pay or HDP, Environmental Differential Pay or EDP)?',
          invalid: (value) => value.pastHazardPay === undefined,
          fields: [
            [
              new RadioField({
                key: 'pastHazardPay',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Do you currently receive any extra pay for hazardous work (examples may be called: Hazardous Duty Pay or HDP, Environmental Differential Pay or EDP)?',
          invalid: (value) => value.currentHazardPay === undefined,
          fields: [
            [
              new RadioField({
                key: 'currentHazardPay',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ]
        },
        {
          question: 'List any way in which your position requires you to be in contact with, or close to hazardous medical waste, such as blood, urine, feces, bodily fluids, needles, syringes, etc. Please provide as much detail as possible:',
          fields: [
            [
              new TextareaField({
                key: 'hazardDetails',
                label: 'Details',
              })
            ]
          ],
        },
        {
          question: 'Do the trash bags that you dispose of ever contain hazardous medical materials, such as blood, urine, feces, bodily fluids, needles, syringes, etc.?',
          invalid: (value) => value.hazardTrashBags === undefined,
          fields: [
            [
              new RadioField({
                key: 'hazardTrashBags',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Is it your job to handle the medical waste bags (these bags are often red) that are designated for hazardous medical waste?',
          invalid: (value) => value.hazardMedicalBags === undefined,
          fields: [
            [
              new RadioField({
                key: 'hazardMedicalBags',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
                onChange: (value, form) => {
                  if (!value) {
                    form.patchValue({
                      bagLeak: false,
                      bagOverflow: false,
                      bagPoke: false,
                    }, {emitEvent: false});
                  }
                }
              })
            ]
          ],
        },
        {
          question: '',
          fields: [
            [
              new CheckboxField({
                key: 'bagLeak',
                label: 'I have handled a medical waste bag with a hole or leak',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'bagOverflow',
                label: 'I have handled an overflowing medical waste bag',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'bagPoke',
                label: 'I have seen sharp objects poking out of medical waste bags',
                position: 'start',
                value: false,
              }),
            ],
          ],
        },
        {
          question: 'Does your position require you to handle dirty linens, towels, blankets, etc.?',
          invalid: (value) => value.hazardLaundry === undefined,
          fields: [
            [
              new RadioField({
                key: 'hazardLaundry',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
                onChange: (value, form) => {
                  if (!value) {
                    form.patchValue({
                      laundryBlood: false,
                      laundryFeces: false,
                      laundryOther: false,
                      laundryMedicalWaste: false,
                    }, {emitEvent: false});
                  }
                }
              })
            ]
          ]
        },
        {
          question: '',
          fields: [
            [
              new CheckboxField({
                key: 'laundryBlood',
                label: 'I have handled dirty laundry with blood.',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'laundryFeces',
                label: 'I have handled dirty laundry with feces or urine.',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'laundryOther',
                label: 'I have handled dirty laundry with other bodily fluids.',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'laundryMedicalWaste',
                label: 'I have handled medical waste (such as syringes, dirty bandages, etc.) that was wrapped up in dirty laundry.',
                position: 'start',
                value: false,
              }),
            ],
          ]
        },
        {
          question: 'Do your duties ever require you to clean up hazardous medical waste, such as blood, urine, feces, bodily fluids, needles, syringes, etc.?',
          invalid: (value) => value.hazardCleanup === undefined,
          fields: [
            [
              new RadioField({
                key: 'hazardCleanup',
                label: '',
                options: yesOrNo$,
                required: true,
                fxLayout: 'row',
              })
            ]
          ],
        },
        {
          question: 'Do you wear any protective medical equipment when handling hazardous medical waste?',
          invalid: (value) => value.protectiveEquipment === undefined,
          fields: [
            [
              new RadioField({
                key: 'protectiveEquipment',
                label: '',
                options: of(protectiveEquipmentOptions),
                required: true,
                fxLayout: 'column',
                onChange: (value, form) => {
                  if (value === 'c' || value === 'd') {
                    form.patchValue({
                      gloves: false,
                      masks: false,
                      faceShields: false,
                      bodySuits: false,
                    }, {emitEvent: false});
                  }
                }
              }),
            ],
          ],
        },
        {
          question: '',
          fields: [
            [
              new CheckboxField({
                key: 'gloves',
                label: 'Gloves',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'masks',
                label: 'Masks',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'faceShields',
                label: 'Face Shields',
                position: 'start',
                value: false,
              }),
            ],
            [
              new CheckboxField({
                key: 'bodySuits',
                label: 'Body Suits',
                position: 'start',
                value: false,
              }),
            ],
          ]
        },
        {
          question: 'Have you been trained on how to safely handle hazardous medical waste?',
          invalid: (value) => value.hazardTraining === undefined,
          fields: [
            [
              new RadioField({
                key: 'hazardTraining',
                label: '',
                options: of(hazardTrainingOptions),
                required: true,
                fxLayout: 'column',
              })
            ],
          ]
        },
        {
          question: 'If you have any other helpful information about this problem, please type it below:',
          fields: [
            [
              new TextareaField({
                key: 'moreInfo',
                label: 'Description',
              })
            ]
          ]
        }
      ],
      onChange: (value) => {
        return {
          modifyQuestions: [
            {
              stepIndex: 2,
              questionIndex: 5,
              modifiedQuestion: value.hazardMedicalBags ? 'Check as many as apply:' : '',
            },
            {
              stepIndex: 2,
              questionIndex: 7,
              modifiedQuestion: value.hazardLaundry ? 'Check as many as apply:' : '',
            },
            {
              stepIndex: 2,
              questionIndex: 10,
              modifiedQuestion: value.protectiveEquipment && (value.protectiveEquipment === 'a' || value.protectiveEquipment === 'b') ? 'Check as many as apply:' : '',
            }
          ]
        };
      },
    },
  ],
};
