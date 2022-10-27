import {
  TableColumn,
  TextColumn,
  CurrencyColumn,
  IconColumn,
  DateColumn,
  NumberColumn,
} from 'vs-table';
import {Employee} from '../../../../models/employee.model';

export class EmployeesTableConfigService {
  public getCols(viewMode: EmployeeViewMode): TableColumn<Employee>[] {
    const baseCols = [
      new TextColumn({
        field: 'id',
        title: 'ID',
      }),
      new TextColumn({
        field: 'firstName',
        title: 'First',
      }),
      new TextColumn({
        field: 'lastName',
        title: 'Last',
      }),
    ];
    switch (viewMode) {
      case 'basic':
        return [
          ...baseCols,
          new CurrencyColumn({
            title: 'Gross',
            field: 'stateAddlamt',
          }),
          new CurrencyColumn({
            title: 'Est. Check',
            field: 'estTotal',
          }),
          new TextColumn({
            title: 'City',
            field: 'city',
          }),
          new TextColumn({
            title: 'State',
            field: 'state',
          }),
          new TextColumn({
            title: 'Zip',
            field: 'zip',
          }),
          new IconColumn({
            title: 'Address?',
            field: 'addressIsInvalid',
            calculate: (row) => row.addressIsInvalid ? 'close' : 'check',
            color: (row) => row.addressIsInvalid ? 'red' : 'green',
          }),
          new IconColumn({
            title: 'Emails?',
            field: 'emailIsInvalid',
            calculate: (row) => row.emailIsInvalid ? 'close' : 'check',
            color: (row) => row.emailIsInvalid ? 'red' : 'green',
          }),
          new IconColumn({
            title: 'Phones?',
            field: 'phoneIsInvalid',
            calculate: (row) => row.phoneIsInvalid ? 'close' : 'check',
            color: (row) => row.phoneIsInvalid ? 'red' : 'green',
          }),
          new TextColumn({
            title: 'Status',
            field: 'status',
          }),
          new TextColumn({
            title: 'User',
            field: 'username',
          }),
          new DateColumn({
            title: 'Assigned',
            field: 'assignedDate',
          }),
          new DateColumn({
            title: 'Last Contacted',
            field: 'contactedDate',
          }),
          new IconColumn({
            title: 'Not Contacted',
            field: 'contacted',
            calculate: (row) => row.contacted ? 'check_box_outline_blank' : 'check_box',
            color: (row) => row.contacted ? '' : 'green',
          }),
        ];
      case 'bue':
        return [
          ...baseCols,
          new CurrencyColumn({
            title: 'Gross',
            field: 'stateAddlamt',
          }),
          new CurrencyColumn({
            title: 'Est. Check',
            field: 'estTotal',
          }),
          new TextColumn({
            title: 'BUE Region',
            field: 'bueRegion',
          }),
          new TextColumn({
            title: 'BUE Local',
            field: 'bueLocal',
          }),
          new TextColumn({
            title: 'BUE Location',
            field: 'bueLocation',
          }),
          new IconColumn({
            title: 'BUE Current',
            field: 'bueCurrent',
            calculate: (row) => row.bueCurrent ? 'check' : 'close',
            color: (row) => row.bueCurrent ? 'green' : 'red',
          }),
          new IconColumn({
            title: 'BUE Member',
            field: 'bueUnionMember',
            calculate: (row) => row.bueUnionMember ? 'check' : 'close',
            color: (row) => row.bueUnionMember ? 'green' : 'red',
          }),
          new TextColumn({
            title: 'Email',
            field: 'email',
          }),
          new TextColumn({
            title: 'Email Alt',
            field: 'emailAlt',
          }),
          new IconColumn({
            title: 'Emails?',
            field: 'emailIsInvalid',
            calculate: (row) => row.emailIsInvalid ? 'close' : 'check',
            color: (row) => row.emailIsInvalid ? 'red' : 'green',
          }),
          new TextColumn({
            title: 'Phone',
            field: 'phone',
          }),
          new TextColumn({
            title: 'Phone Work',
            field: 'phoneWork',
          }),
          new TextColumn({
            title: 'Phone Cell',
            field: 'phoneCell',
          }),
          new IconColumn({
            title: 'Phones?',
            field: 'phoneIsInvalid',
            calculate: (row) => row.phoneIsInvalid ? 'close' : 'check',
            color: (row) => row.phoneIsInvalid ? 'red' : 'green',
          }),
          new TextColumn({
            title: 'Status',
            field: 'status',
          }),
        ];
      case 'financial':
        return [
          ...baseCols,
          new TextColumn({
            title: 'Middle',
            field: 'middleName',
          }),
          new CurrencyColumn({
            title: 'Donation',
            field: 'donation',
          }),
          new CurrencyColumn({
            title: 'SPOT BP',
            field: 'spotBp',
          }),
          new CurrencyColumn({
            title: 'CTOT BP',
            field: 'ctotBp',
          }),
          new CurrencyColumn({
            title: 'Att.',
            field: 'attimpCost',
          }),
          new CurrencyColumn({
            title: 'ERSS',
            field: 'estEmployerSs',
          }),
          new CurrencyColumn({
            title: 'ERMC',
            field: 'estEmployerMc',
          }),
          new CurrencyColumn({
            title: 'Cost',
            field: 'estCostShare',
          }),
          new CurrencyColumn({
            title: 'IRS',
            field: 'estFedWh',
          }),
          new CurrencyColumn({
            title: 'IRS+',
            field: 'fedAddlamt',
          }),
          new CurrencyColumn({
            title: 'State',
            field: 'estStateWh',
          }),
          new CurrencyColumn({
            title: 'State+',
            field: 'stateAddlamt',
          }),
          new CurrencyColumn({
            title: 'EESS',
            field: 'estEmployeeSs',
          }),
          new CurrencyColumn({
            title: 'EEMC',
            field: 'estEmployeeMc',
          }),
          new CurrencyColumn({
            title: 'SPOT LD',
            field: 'spotLd',
          }),
          new CurrencyColumn({
            title: 'CTOT LD',
            field: 'ctotLd',
          }),
          new CurrencyColumn({
            title: 'Total',
            field: 'estTotal',
          }),
          new TextColumn({
            title: 'State',
            field: 'state',
          }),
          new IconColumn({
            title: 'FX',
            field: 'fedExempt',
            calculate: (row) => row.fedExempt ? 'check' : 'close',
            color: (row) => row.fedExempt ? 'green' : 'red',
          }),
          new IconColumn({
            title: 'SSX',
            field: 'fedSsExempt',
            calculate: (row) => row.fedSsExempt ? 'check' : 'close',
            color: (row) => row.fedSsExempt ? 'green' : 'red',
          }),
          new IconColumn({
            title: 'MCX',
            field: 'fedMcExempt',
            calculate: (row) => row.fedMcExempt ? 'check' : 'close',
            color: (row) => row.fedMcExempt ? 'green' : 'red',
          }),
          new NumberColumn({
            title: 'Est. S%',
            field: 'estEffStateRate',
          }),
          new NumberColumn({
            title: 'S%',
            field: 'stateRate',
          }),
          new IconColumn({
            title: 'SX',
            field: 'stateExempt',
            calculate: (row) => row.stateExempt ? 'check' : 'close',
            color: (row) => row.stateExempt ? 'green' : 'red',
          }),
          new TextColumn({
            title: 'Status',
            field: 'status',
          }),
        ];
      default:
        return [];
    }
  }
}

export type EmployeeViewMode = 'basic' | 'bue' | 'financial';

export interface IEmployeeViewMode {
  displayName: string;
  name: EmployeeViewMode;
}
