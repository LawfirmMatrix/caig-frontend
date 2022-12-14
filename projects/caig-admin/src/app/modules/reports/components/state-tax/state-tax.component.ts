import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, DateRangeField, CheckboxField, SelectField} from 'dynamic-form';
import {map, filter, switchMap, shareReplay} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {tap, debounceTime, startWith, Observable} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {settlementStates} from '../../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../../enums/store/actions/action-types';
import {isNotUndefined} from '../../../../core/util/functions';
import {TableColumn, TextColumn, CalculateColumn, NumberColumn, CurrencyColumn} from 'vs-table';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {ReportsComponent} from '../reports/reports.component';
import {ReportDataService} from '../../services/report-data.service';
import {TreeData, TreeNode} from 'tree-viewer';
import {sumBy} from 'lodash-es';

@Component({
  selector: 'app-state-tax',
  templateUrl: './state-tax.component.html',
  styleUrls: ['./state-tax.component.scss']
})
export class StateTaxComponent implements OnInit {
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new DateRangeField({
        key: 'dates',
        label: 'Date range',
      }),
      new SelectField({
        key: 'state',
        label: 'State',
        options: this.store.select(settlementStates).pipe(
          tap((states) => {
            if (!states) {
              this.store.dispatch(EnumsActions.loadEnums({enumType: 'settlementStates'}));
            }
          }),
          filter(isNotUndefined),
          map((states) => states.map((value) => ({value, name: `${value} - ${statesMap[value]}`})))
        ),
        fxFlex: 0,
        itemKey: 'value',
        displayField: 'name',
        deselect: true,
      }),
      new CheckboxField({
        key: 'allSettlements',
        label: 'All settlements',
        value: false,
        position: 'start',
      }),
    ]
  ];
  public model$ = this.route.queryParams
    .pipe(
      map((qp) => ({
        dates: {
          start: qp['fromDate'],
          end: qp['toDate'],
        },
        state: qp['state'],
        allSettlements: qp['allSettlements'] === 'true',
      }))
    );
  public columns: TableColumn<TaxDetail>[] = [
    new TextColumn({
      title: 'Settlement',
      field: 'settlementCode',
    }),
    new CalculateColumn({
      title: 'SSN',
      field: 'ssn',
      calculate: (row) => row.ssn || ReportsComponent.ENCRYPTED_SSN,
    }),
    new TextColumn({
      title: 'First',
      field: 'firstName',
    }),
    new TextColumn({
      title: 'Middle',
      field: 'middleName',
    }),
    new TextColumn({
      title: 'Last',
      field: 'lastName',
    }),
    new NumberColumn({
      title: 'Payments',
      field: 'paymentCount',
      sum: true,
      format: '1.0-0',
    }),
    new CurrencyColumn({
      title: 'Gross Wages',
      field: 'totalBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'State Tax',
      field: 'stateTaxes',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Fed Tax',
      field: 'fedTaxes',
      sum: true,
    })
  ];
  public data$ = this.model$
    .pipe(
      switchMap((model) =>
        this.dataService.taxDetail(model.dates.start, model.dates.end, model.allSettlements, model.state)
          .pipe(startWith(null))
      ),
      startWith([]),
      shareReplay(),
    );
  public treeData$: Observable<TreeData<TaxDetailNode> | null> = this.data$
    .pipe(
      map((data) => {
        if (!data) {
          return data;
        }
        const nodes: TaxDetailNode[] = [];
        const headerFooterDimensions = [
          { header: 'Year' },
          { header: 'Quarter' },
          { header: 'Month' },
          { header: 'Date' },
          { header: 'Employees in Payroll', total: 0, type: 'number' as 'number', format: '1.0-0' },
          { header: 'Gross Wages', total: 0 },
          { header: 'State Taxes', total: 0 },
          { header: 'Fed Taxes', total: 0 },
        ];
        const treeData: TreeData<TaxDetailNode> = {
          nodes,
          total: sumBy(nodes, (n) => n.value),
          dimensions: headerFooterDimensions,
        };
        return treeData;
      })
    );
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>,
    private dataService: ReportDataService,
  ) {
  }
  public ngOnInit() {
    this.form.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        const queryParams = { fromDate: value.dates.start, toDate: value.dates.end, state: value.state, allSettlements: value.allSettlements };
        this.router.navigate([], {queryParams, queryParamsHandling: 'merge', replaceUrl: true});
      });
  }
}

const statesMap: {[key: string]: string} = {
  AA: 'U.S. Armed Forces - Americas',
  AE: 'U.S. Armed Forces - Europe',
  AK: 'Alaska',
  AL: 'Alabama',
  AP: 'U.S. Armed Forces - Pacific',
  AR: 'Arkansas',
  AS: 'American Samoa',
  AZ: 'Arizona',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DC: 'District of Columbia',
  DE: 'Delaware',
  FL: 'Florida',
  FM: 'Federated States of Micronesia',
  GA: 'Georgia',
  GU: 'Guam',
  HI: 'Hawaii',
  IA: 'Iowa',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  MA: 'Massachusetts',
  MD: 'Maryland',
  ME: 'Maine',
  MH: 'Marshall Islands',
  MI: 'Michigan',
  MN: 'Minnesota',
  MO: 'Missouri',
  MP: 'Northern Mariana Islands',
  MS: 'Mississippi',
  MT: 'Montana',
  NC: 'North Carolina',
  ND: 'North Dakota',
  NE: 'Nebraska',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NV: 'Nevada',
  NY: 'New York',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  PR: 'Puerto Rico',
  PW: 'Palau',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VA: 'Virginia',
  VI: 'Virgin Islands',
  VT: 'Vermont',
  WA: 'Washington',
  WI: 'Wisconsin',
  WV: 'West Virginia',
  WY: 'Wyoming',
};

export interface TaxDetailNode extends TreeNode<TaxDetailNode> {

}
