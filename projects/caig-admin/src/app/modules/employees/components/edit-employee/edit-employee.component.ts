import {Component} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {
  FieldBase,
  CheckboxField,
  ChipsField,
  CurrencyField,
  InputField,
  PhoneNumberField,
  SelectField,
  TextareaField
} from 'dynamic-form';
import {debounceTime, filter, map, switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ActivatedRoute} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {isEqual, omitBy} from 'lodash-es';
import {Employee} from '../../../../models/employee.model';
import {yesOrNo$} from '../../../../core/util/consts';
import {EmployeeEntityService} from '../../services/employee-entity.service';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {ToolbarButton} from '../../../shared/employee/component/toolbar-buttons/toolbar-buttons.component';
import {isNotUndefined, participationRowPainter} from '../../../../core/util/functions';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';
import {
  bueLocals,
  bueLocations,
  bueRegions,
  employeeStatusesFlat, participationStatuses
} from '../../../../enums/store/selectors/enums.selectors';
import {settlements} from '../../../../core/store/selectors/core.selectors';
import {usersForSettlement} from '../../../users/store/selectors/user.selectors';
import {NotificationsService} from 'notifications';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent {
  public employee: EditEmployee | undefined;
  public isHandset!: boolean;
  public gridColumns!: number;
  public form = new UntypedFormGroup({});
  public disableSave = true;
  public sections: EditSection[] = [
    {
      cols: 6,
      rowspan: 55,
      title: 'Name',
      fields: [
        [
          new CheckboxField({
            key: 'deceased',
            label: 'Deceased',
            position: 'start',
          })
        ],
        [
          new InputField({
            key: 'firstName',
            label: 'First',
            required: true,
          }),
          new InputField({
            key: 'middleName',
            label: 'Middle',
          }),
          new InputField({
            key: 'lastName',
            label: 'Last',
            required: true,
          }),
          new InputField({
            key: 'suffix',
            label: 'Suffix',
          }),
        ],
        [
          new InputField({
            key: 'bueId',
            label: 'BUE ID',
          }),
          new SelectField({
            key: 'bueCurrent',
            label: 'BUE Current?',
            options: yesOrNo$,
            displayField: 'name',
            itemKey: 'value',
            deselect: true,
          }),
          new SelectField({
            key: 'bueMember',
            label: 'BUE Member?',
            options: yesOrNo$,
            displayField: 'name',
            itemKey: 'value',
            deselect: true,
          })
        ],
        [
          new SelectField({
            key: 'bueRegion',
            label: 'BUE Region',
            options: this.store.select(bueRegions).pipe(
              map((states) => states ? states.map((name) => ({name})) : null),
            ),
            displayField: 'name',
            itemKey: 'name',
            deselect: true,
          }),
          new SelectField({
            key: 'bueLocal',
            label: 'BUE Local',
            options: this.store.select(bueLocals).pipe(
              map((states) => states ? states.map((name) => ({name})) : null),
            ),
            displayField: 'name',
            itemKey: 'name',
            deselect: true,
          }),
          new SelectField({
            key: 'bueLocation',
            label: 'BUE Location',
            itemKey: 'name',
            displayField: 'name',
            options: this.store.select(bueLocations).pipe(
              map((states) => states ? states.map((name) => ({name})) : null),
            ),
            deselect: true,
          }),
        ],
        [
          new SelectField({
            key: 'bueStartYear',
            label: 'BUE Start Year',
            options: of([]),
            displayField: '',
            itemKey: '',
            deselect: true,
          }),
          new SelectField({
            key: 'bueStartQuarter',
            label: 'BUE Start Quarter',
            options: of([]),
            displayField: '',
            itemKey: '',
            deselect: true,
          }),
          new SelectField({
            key: 'bueEndYear',
            label: 'BUE End Year',
            options: of([]),
            displayField: '',
            itemKey: '',
            deselect: true,
          }),
          new SelectField({
            key: 'bueEndQuarter',
            label: 'BUE End Quarter',
            options: of([]),
            displayField: '',
            itemKey: '',
            deselect: true,
          }),
        ],
        [
          new InputField({
            type: 'number',
            key: 'busCode',
            label: 'BUS Code',
          }),
          new InputField({
            type: 'number',
            key: 'grade',
            label: 'Grade',
          }),
          new InputField({
            type: 'number',
            key: 'step',
            label: 'Step',
          }),
          new InputField({
            type: 'number',
            key: 'series',
            label: 'Series',
          }),
        ],
      ],
    },
    {
      cols: 3,
      rowspan: 55,
      title: 'Tags',
      fields: [
        [
          new ChipsField({
            label: 'Tags',
            key: '_tags',
          })
        ]
      ],
    },
    {
      cols: 3,
      rowspan: 55,
      title: 'Other Info',
      fields: [
        [
          new TextareaField({
            key: 'notes',
            label: 'Notes',
          })
        ]
      ],
    },
    {
      cols: 4,
      rowspan: 28,
      title: 'Address',
      fields: [
        [
          new CheckboxField({
            key: 'addressIsInvalid',
            label: 'This address is invalid',
            position: 'start',
          })
        ],
        [
          new InputField({
            key: 'address1',
            label: 'Line 1',
          }),
          new InputField({
            key: 'address2',
            label: 'Line 2',
          }),
        ],
        [
          new InputField({
            key: 'city',
            label: 'City',
          }),
          new InputField({
            key: 'state',
            label: 'State',
          }),
          new InputField({
            key: 'zip',
            label: 'Zip',
          }),
        ],
      ],
    },
    {
      cols: 4,
      rowspan: 28,
      title: 'Phone',
      fields: [
        [
          new CheckboxField({
            key: 'phoneIsInvalid',
            label: 'None of the phones are valid',
            position: 'start',
          })
        ],
        [
          new PhoneNumberField({
            key: 'phone',
            label: 'Phone',
            hint: { message: '', align: 'start' },
            position: 'start',
          }),
          new PhoneNumberField({
            key: 'phoneCell',
            label: 'Phone Cell',
            hint: { message: '', align: 'start' },
            position: 'start',
          }),
        ],
        [
          new PhoneNumberField({
            key: 'phoneWork',
            label: 'Phone Work',
            extension: true,
            hint: { message: '', align: 'start' },
            position: 'start',
          }),
        ]
      ],
    },
    {
      cols: 4,
      rowspan: 28,
      title: 'Email',
      fields: [
        [
          new InputField({
            key: 'email',
            label: 'Email',
          }),
          new CheckboxField({
            key: 'emailIsInvalid',
            label: 'Email is invalid',
          })
        ],
        [
          new InputField({
            key: 'emailAlt',
            label: 'Alternative Email',
          }),
          new CheckboxField({
            key: 'emailAltIsInvalid',
            label: 'Alt email is invalid',
          })
        ]
      ],
    },
    {
      cols: 6,
      rowspan: 15,
      title: 'Federal Taxes',
      fields: [
        [
          new CheckboxField({
            key: 'fedExempt',
            label: 'Fed. tax exempt',
            position: 'start',
          }),
          new CheckboxField({
            key: 'fedSsExempt',
            label: 'Soc. security exempt',
            position: 'start',
          }),
          new CheckboxField({
            key: 'fedMcExempt',
            label: 'Medicare exempt',
            position: 'start',
          }),
          new InputField({
            type: 'number',
            key: 'fedAddlamt',
            label: 'Additional federal tax (negative amount)',
            placeholder: '0.00',
            fxFlex: 50,
          })
        ],
      ],
    },
    {
      cols: 3,
      rowspan: 15,
      title: 'State Taxes',
      fields: [
        [
          new CheckboxField({
            key: 'stateExempt',
            label: 'State tax exempt',
            position: 'start',
          }),
          new InputField({
            type: 'number',
            key: 'stateAddlamt',
            label: 'Additional state tax (negative amount)',
            placeholder: '0.00',
            fxFlex: 50,
          })
        ],
      ],
    },
    {
      cols: 3,
      rowspan: 15,
      title: 'Donation',
      fields: [
        [
          new InputField({
            type: 'number',
            key: 'donation',
            label: 'Donation (positive amount)',
            placeholder: '0.00',
            fxFlex: 50,
          })
        ]
      ],
    },
    {
      cols: 6,
      rowspan: 24,
      title: 'Money',
      fields: [
        [
          new CurrencyField({
            key: 'spotBp',
            label: 'SPOT BP',
          }),
          new CurrencyField({
            key: 'ctotBp',
            label: 'CTOT BP',
          }),
          new CurrencyField({
            key: 'spotLd',
            label: 'SPOT LD',
          }),
          new CurrencyField({
            key: 'ctotLd',
            label: 'CTOT LD',
          }),
        ],
        [
          new CurrencyField({
            key: 'estCostShare',
            label: 'Cost Share',
          }),
        ]
      ],
    },
    {
      cols: 2,
      rowspan: 24,
      title: 'Adjustments',
      fields: [
        [
          new CurrencyField({
            key: 'addlamt',
            label: 'Negative reduces net check'
          })
        ]
      ],
    },
    {
      cols: 2,
      rowspan: 24,
      title: 'Settlement',
      fields: [
        [
          new SelectField({
            key: 'settlementId',
            label: 'Settlement',
            options: this.store.select(settlements).pipe(filter(isNotUndefined)),
            itemKey: 'id',
            displayField: 'code',
            required: true,
          })
        ]
      ],
    },
    {
      cols: 2,
      rowspan: 24,
      title: 'Status',
      fields: [
        [
          new SelectField({
            key: 'status',
            label: 'Status',
            options: this.store.select(employeeStatusesFlat).pipe(filter(isNotUndefined)),
            itemKey: 'name',
            displayField: 'displayName',
            deselect: true,
          })
        ]
      ],
    },
    {
      cols: 3,
      rowspan: 15,
      title: 'Assignments',
      fields: [
        [
          new SelectField({
            key: 'userId',
            label: 'User',
            options: this.store.select(usersForSettlement).pipe(filter(isNotUndefined)),
            itemKey: 'id',
            displayField: 'name',
            deselect: true,
          }),
        ]
      ],
    },
    {
      cols: 3,
      rowspan: 15,
      title: 'Participation',
      fields: [
        [
          new SelectField({
            key: 'participationStatus',
            label: 'Participation Status',
            options: this.store.select(participationStatuses).pipe(
              map((states) => states ? states.map((name) => ({name})) : null),
            ),
            itemKey: 'name',
            displayField: 'name',
            deselect: true,
            optionColor: (option) => participationRowPainter(option.name),
          }),
        ]
      ],
    },
  ];
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'Employee',
      icon: 'chevron_left',
      routerLink: '../view',
    }
  ];
  constructor(
    private bp: BreakpointObserver,
    private dataService: EmployeeEntityService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private notifications: NotificationsService,
  ) { }
  public ngOnInit() {
    this.route.params.pipe(switchMap(({id}) => this.dataService.getByKey(id)))
      .subscribe((employee) => this.employee = { ...employee, _tags: employee.tags.map((t) => t.name) });
    this.bp.observe(Breakpoints.Handset)
      .subscribe(({matches}) => {
        this.isHandset = matches;
        this.gridColumns = matches ? 1 : 12;
      });
    this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe((value) => {
        const changes = omitBy({...this.employee, ...value}, (p) => p === undefined || p === null);
        this.disableSave = this.form.invalid || isEqual(changes, this.employee);
      });
  }
  public save(): void {
    if (this.employee?.settlementId !== this.form.value.settlementId) {
      const data: ConfirmDialogData = { title: 'Warning!', text: 'Are you sure you want to change the settlement for this employee? You will no longer see this employee under the current settlement.' };
      this.dialog.open(ConfirmDialogComponent, { data })
        .afterClosed()
        .pipe(filter((res) => !!res))
        .subscribe(() => this.updateEmployee());
    } else {
      this.updateEmployee();
    }
  }
  private updateEmployee(): void {
    this.disableSave = true;
    const payload: any = omitBy({...this.employee, ...this.form.value}, (v) => v === undefined);
    payload.tags = payload._tags;
    delete payload._tags;
    this.dataService.update(payload).subscribe(() => {
      this.employee = payload;
      this.notifications.showSimpleInfoMessage('Successfully updated employee record');
    }, () => this.disableSave = false);
  }
}

interface EditSection {
  cols: number;
  rowspan: number;
  title: string;
  fields: FieldBase<any>[][];
}

interface EditEmployee extends Employee {
  _tags: string[];
}


