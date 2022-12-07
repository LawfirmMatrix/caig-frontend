import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {SettlementComponent} from '../settlement.component';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {
  FieldBase,
  InputField,
  SelectField,
  DateField,
  CurrencyField,
  PhoneNumberField,
  CheckboxField, TextareaField
} from 'dynamic-form';
import {of, startWith} from 'rxjs';
import {SettlementType} from '../../../../models/settlement.model';
import {startCase} from 'lodash-es';
import {map, switchMap} from 'rxjs/operators';
import {LoadingService} from '../../../../core/services/loading.service';
import {SettlementEntityService} from '../../services/settlement-entity.service';
import {NotificationsService} from 'notifications';

@Component({
  selector: 'app-edit-settlement',
  templateUrl: './edit-settlement.component.html',
  styleUrls: ['./edit-settlement.component.scss']
})
export class EditSettlementComponent extends SettlementComponent {
  public form = new UntypedFormGroup({});
  public disableSave$ = this.form.statusChanges.pipe(
    map((status) => status !== 'VALID'),
    startWith(true),
  );
  public sections: SettlementSection[] = [
    {
      header: 'General',
      fields: [
        [
          new InputField({
            key: 'code',
            label: 'Code',
            required: true,
            hint: {
              message: 'Letters and numbers only',
              align: 'start',
            }
          })
        ],
        [
          new InputField({
            key: 'title',
            label: 'Title',
            required: true,
          }),
        ],
        [
          new InputField({
            key: 'titleLong',
            label: 'Title Long',
            required: true,
          })
        ],
        [
          new SelectField({
            key: 'type',
            label: 'Type',
            options: of(Object.keys(SettlementType).slice(4).map((value) => ({value, name: startCase(value)}))),
            itemKey: 'value',
            displayField: 'name',
            required: true,
          })
        ],
        [
          new DateField({
            key: 'date',
            label: 'Date',
            required: true,
          }),
        ],
        [
          new CurrencyField({
            key: 'liabilityAmount',
            label: 'Liability Amount',
            required: true,
            hint: {
              message: 'Including set-aside',
              align: 'start',
            }
          })
        ],
        [
          new CurrencyField({
            key: 'accruedInterestAmount',
            label: 'Accrued Interest',
          })
        ],
        [
          new InputField({
            key: 'case',
            label: 'Case Number',
            hint: {
              message: 'If applicable',
              align: 'start',
            }
          })
        ],
      ],
    },
    {
      header: 'Contact',
      fields: [
        [
          new InputField({
            key: 'adminEmail',
            label: 'Admin Email',
            required: true,
            validators: [ Validators.email ],
          }),
        ],
        [
          new PhoneNumberField({
            key: 'adminPhone',
            label: 'Admin Phone',
            required: true,
            position: 'start',
            extension: true,
          }),
        ],
        [
          new PhoneNumberField({
            key: 'adminFax',
            label: 'Admin Fax',
            position: 'start',
            extension: true,
          })
        ],
      ],
    },
    {
      header: 'Settings',
      fields: [
        [
          new SelectField({
            key: 'checkTemplate',
            label: 'Check Template',
            options: of([
              'BLM_check_signed_by_MB_and_RZ',
              'BLM_check_signed_by_MB_only',
              'Standard_check_signed_by_MB',
              'Standard_check_signed_by_MB_v02',
              'Standard_check_unsigned',
            ].map((value) => ({value, name: value.replace(/_/g, ' ')}))),
            itemKey: 'value',
            displayField: 'name',
            deselect: true,
          })
        ],
        [
          new CheckboxField({
            key: 'isPublic',
            label: 'Publicly visible',
            value: false,
            position: 'start',
          }),
        ],
        [
          new CheckboxField({
            key: 'isOpen',
            label: 'Online / allow logins',
            value: false,
            position: 'start',
          }),
        ],
        [
          new CheckboxField({
            key: 'canDonate',
            label: 'Enable donation option',
            value: false,
            position: 'start',
          })
        ]
      ],
    },
    {
      header: 'Defendant / Plaintiff',
      fields: [
        [
          new InputField({
            key: 'defendantName',
            label: 'Defendant',
            required: true,
          }),
        ],
        [
          new InputField({
            key: 'defendantAttorneyName',
            label: 'Defendant Attorney',
            required: true,
          })
        ],
        [
          new InputField({
            key: 'plaintiffName',
            label: 'Plaintiff',
            required: true,
          }),
        ],
        [
          new InputField({
            key: 'plaintiffAttorneyName',
            label: 'Plaintiff Attorney',
            required: true,
          })
        ],
      ],
    },
    {
      header: 'Styles',
      fields: [
        [
          new InputField({
            key: 'logoImage',
            label: 'Logo',
            hint: {
              message: 'Provide full URL of image',
              align: 'start',
            },
          })
        ],
        [
          new SelectField({
            key: 'bannerPrefix',
            label: 'Banner',
            options: of([
              'Default',
              'AFGE',
              'AFGE12',
              'AFGE2419',
              'AFGE2883',
              'AFGE IHS Claims',
              'LIUNA',
              'LIUNADIST3',
              'LIUNA 29F',
              'LIUNA IHS Claims',
              'LIUNA IHS registration',
              'NAGE',
              'NFFE',
              'NFFE405',
              'NFFE IHS Claims',
              'RBCA',
            ].map((value) => ({value}))),
            itemKey: 'value',
            displayField: 'value',
            value: 'Default',
          }),
        ],
        [
          new SelectField({
            key: 'stylePrefix',
            label: 'Style',
            options: of([
              'Default',
              'AFGE',
              'LIUNA',
              'NAGE',
              'NFFE',
            ].map((value) => ({value}))),
            itemKey: 'value',
            displayField: 'value',
            value: 'Default',
          }),
        ],
      ],
    },
    {
      header: 'Content',
      fields: [
        [
          new TextareaField({
            key: 'textEmailIntro',
            label: 'Email Intro (first paragraph)',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new TextareaField({
            key: 'textFrontpage',
            label: 'Front Page',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new TextareaField({
            key: 'textIntro',
            label: 'Intro Text',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new TextareaField({
            key: 'textDonation',
            label: 'Donation Text',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new TextareaField({
            key: 'textOptout',
            label: 'Opt-Out Text (if blank, default will be used)',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new TextareaField({
            key: 'textAgrmtIntro',
            label: 'Agreement Intro',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new TextareaField({
            key: 'textAgrmtContent',
            label: 'Agreement Content (if blank, default will be used)',
            hint: {
              message: 'HTML',
              align: 'start',
            }
          })
        ],
        [
          new SelectField({
            key: 'paymentTimeframe',
            label: 'Payment will be processed in...',
            options: of([
              'approximately 8-10 weeks',
              'approximately 10-12 weeks',
              'approximately 12-14 weeks',
            ].map((value) => ({value}))),
            itemKey: 'value',
            displayField: 'value',
            deselect: true,
          })
        ]
      ],
    },
    {
      header: 'Form 1187',
      fields: [
        [
          new SelectField({
            key: 'formTemplate',
            label: 'Template for Union Forms',
            options: of([
              'AFGE22 dues form',
              'AFGE22 dues form 2016',
              'AFGE22 dues form updated',
              'AFGE dues form',
              'FISE dues form',
              'General OPM Form 1187',
              'USACE dues form',
              'USAID dues form',
            ].map((value) => ({value}))),
            itemKey: 'value',
            displayField: 'value',
            onChange: (value, form) => {
              const controls = [
                'form1187Agency',
                'form1187LaborOrg',
                'form1187LaborOrgShort',
                'form1187DuesAmount',
                'form1187DuesFrequency'
              ];
              const func = value === 'General OPM Form 1187' ? 'enable' : 'disable';
              controls.forEach((ctrl) => form.controls[ctrl][func]());
            },
            deselect: true,
          }),
        ],
        [
          new InputField({
            key: 'form1187Agency',
            label: 'Agency',
            disabled: true,
          })
        ],
        [
          new InputField({
            key: 'form1187LaborOrg',
            label: 'Labor Organization',
            disabled: true,
          })
        ],
        [
          new InputField({
            key: 'form1187LaborOrgShort',
            label: 'Labor Organization (short)',
            disabled: true,
          })
        ],
        [
          new InputField({
            key: 'form1187DuesAmount',
            label: 'Dues Amount',
            disabled: true,
          })
        ],
        [
          new InputField({
            key: 'form1187DuesFrequency',
            label: 'Dues Frequency',
            disabled: true,
          })
        ],
      ],
    },
    {
      header: 'Lexicon Overrides',
      description: 'These settings allow overriding terms used on check estimates.',
      fields: [
        [
          new InputField({
            key: 'spotName',
            label: 'Name for SPOT Damages',
            hint: {
              message: 'Default: "SPOT Damages"',
              align: 'start',
            }
          })
        ],
        [
          new InputField({
            key: 'ctotName',
            label: 'Name for CTOT Damages',
            hint: {
              message: 'Default: "Comp Time / Overtime Damages"',
              align: 'start',
            }
          })
        ],
        [
          new InputField({
            key: 'bpName',
            label: 'Name for Back Pay',
            hint: {
              message: 'Default: "Back Pay"',
              align: 'start',
            }
          })
        ],
        [
          new InputField({
            key: 'ldName',
            label: 'Name for Liquidated Damages',
            hint: {
              message: 'Default: "Liquidated Damages"',
              align: 'start',
            }
          })
        ],
        [
          new InputField({
            key: 'attimpName',
            label: 'Name for Attorney Costs',
            hint: {
              message: 'Default: "Attorney Fees / Implementation and Other Costs"',
              align: 'start',
            }
          })
        ],
        [
          new InputField({
            key: 'donationName',
            label: 'Donation',
            hint: {
              message: 'Default: "Union Donation"',
              align: 'start',
            }
          })
        ],
      ],
    }
  ];
  constructor(
    protected override route: ActivatedRoute,
    private loadingService: LoadingService,
    private dataService: SettlementEntityService,
    private notifications: NotificationsService,
    private router: Router,
  ) {
    super(route);
  }
  public save(): void {
    this.loadingService.load(
      this.settlement$.pipe(
        switchMap((settlement) => {
          const payload = { ...settlement, ...this.form.value };
          return payload.id ? this.dataService.update(payload) : this.dataService.add(payload);
        })
      )
    ).subscribe(() => {
      this.notifications.showSimpleInfoMessage('Successfully saved settlement');
      this.router.navigate(['/settlements']);
    });
  }
}

interface SettlementSection {
  header: string;
  description?: string;
  fields: FieldBase<any>[][];
}
