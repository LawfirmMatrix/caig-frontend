import {Component} from '@angular/core';
import {SelectField} from 'dynamic-form';
import {map, filter, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {tap, Observable, startWith} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {settlementStates} from '../../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../../enums/store/actions/action-types';
import {isNotUndefined} from '../../../../core/util/functions';
import {TableColumn, TextColumn, CurrencyColumn} from 'vs-table';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {ReportsComponent} from '../reports/reports.component';
import {ReportDataService} from '../../services/report-data.service';
import {TaxDetailComponent} from '../tax-detail.component';
import {groupBy, sumBy} from 'lodash-es';
import * as moment from 'moment';
import {TreeData, TreeNode} from 'vs-tree-viewer';

@Component({
  selector: 'app-state-tax',
  templateUrl: './state-tax.component.html',
  styleUrls: ['./state-tax.component.scss']
})
export class StateTaxComponent extends TaxDetailComponent {
  public columns: TableColumn<TaxDetail>[] = [
    ReportsComponent.SSN_COL,
    new TextColumn({
      title: 'Settlement',
      field: 'settlementCode',
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
  public treeData$: Observable<TreeData<TaxDetailNode> | null> = this.model$
    .pipe(
      switchMap((model) =>
        this.dataService.paymentDetail(model.dates.start, model.dates.end, model.allSettlements, model.state)
          .pipe(startWith(null))
      ),
      map((data) => {
        if (!data) {
          return data;
        }

        const payrollDates = groupBy(data, (row) => row.payrollDate);

        const baseDetailWithPaymentCount = {
          paymentCount: 0,
          totalBp: 0,
          stateTaxes: 0,
          fedTaxes: 0
        };

        const dataByDate: TaxDetail[] = Object.keys(payrollDates).map((date) =>
          payrollDates[date].reduce((withPaymentCount, detail) => ({
            ...withPaymentCount,
            ...detail,
            paymentCount: withPaymentCount.paymentCount + 1,
            totalBp: withPaymentCount.totalBp + detail.totalBp,
            stateTaxes: withPaymentCount.stateTaxes + detail.stateTaxes,
            fedTaxes: withPaymentCount.fedTaxes + detail.fedTaxes,
          } as TaxDetail), baseDetailWithPaymentCount) as TaxDetail
        );

        const headerFooterDimensions = [
          { header: 'Year' },
          { header: 'Quarter' },
          { header: 'Month' },
          { header: 'Date' },
          { header: 'Employees', total: 0, type: 'number' as 'number', format: '1.0-0' },
          { header: 'Gross Wages', total: 0, type: 'currency' as 'currency' },
          { header: 'State Taxes', total: 0, type: 'currency' as 'currency'},
          { header: 'Fed Taxes', total: 0, type: 'currency' as 'currency' },
        ];

        const years = groupBy(dataByDate, (row) => moment(row.payrollDate).year());

        const quarteredYears = Object.keys(years).reduce((prev, curr) => ({...prev, [curr]: groupBy(years[curr], (row) => moment(row.payrollDate).quarter())}), {} as any);

        const monthedYears: any = { };

        for (let year in quarteredYears) {
          monthedYears[year] = { };
          for (let quarter in quarteredYears[year]) {
            monthedYears[year][quarter] = groupBy(quarteredYears[year][quarter], (row) => moment(row.payrollDate).month());
          }
        }

        const blankColumns = 4;

        const sumParent = (parent: any, child: any) => {
          parent.dimensions.slice(blankColumns).forEach((d: any, i: number) => {
            const offsetIndex = i + blankColumns;
            parent.dimensions[offsetIndex].value += child.dimensions[offsetIndex].value;
          });
        };

        const nodes: TaxDetailNode[] = Object.keys(monthedYears).reduce((prev, year) => {
          const parent0: any = {
            name: `Year ${year}`,
            depth: 0,
            parent: null,
            dimensions: [
              { value: null },
              { value: null },
              { value: null },
              { value: null },
              { value: 0, type: 'number' as 'number', format: '1.0-0' },
              { value: 0, type: 'currency' as 'currency' },
              { value: 0, type: 'currency' as 'currency' },
              { value: 0, type: 'currency' as 'currency' },
            ],
          };

          const quarters = Object.keys(monthedYears[year]).reduce((pre, quarter) => {
            const parent1: any = {
              name: `Quarter ${quarter} / ${year}`,
              depth: 1,
              parent: parent0,
              dimensions: [
                { value: null },
                { value: null },
                { value: null },
                { value: null },
                { value: 0, type: 'number', format: '1.0-0' },
                { value: 0, type: 'currency' },
                { value: 0, type: 'currency' },
                { value: 0, type: 'currency' },
              ],
            };

            const months = Object.keys(monthedYears[year][quarter]).reduce((p, month) => {
              const monthName = moment(month, 'M').format('MMMM');
              const parent2: any = {
                name: `${monthName} ${year}`,
                depth: 2,
                parent: parent1,
                dimensions: [
                  { value: null },
                  { value: null },
                  { value: null },
                  { value: null },
                  { value: sumBy(monthedYears[year][quarter][month], (row: TaxDetail) => row.paymentCount), type: 'number', format: '1.0-0' },
                  { value: sumBy(monthedYears[year][quarter][month], (row: TaxDetail) => row.totalBp), type: 'currency' },
                  { value: sumBy(monthedYears[year][quarter][month], (row: TaxDetail) => row.stateTaxes), type: 'currency' },
                  { value: sumBy(monthedYears[year][quarter][month], (row: TaxDetail) => row.fedTaxes), type: 'currency' },
                ],
              };

              sumParent(parent1, parent2);

              return [
                ...p,
                parent2,
                ...monthedYears[year][quarter][month].map((row: TaxDetail, index: number) => ({
                  name: `#${index + 1}`,
                  depth: 3,
                  parent: parent2,
                  dimensions: [
                    { value: year },
                    { value: quarter },
                    { value: month },
                    { value: row.payrollDate, type: 'date' },
                    { value: row.paymentCount, type: 'number', format: '1.0-0' },
                    { value: row.totalBp, type: 'currency' },
                    { value: row.stateTaxes, type: 'currency' },
                    { value: row.fedTaxes, type: 'currency' },
                  ],
                })),
              ];
            }, [] as TaxDetailNode[]);

            sumParent(parent0, parent1);

            return [
              ...pre,
              parent1,
              ...months,
            ];
          }, [] as TaxDetailNode[]);

          headerFooterDimensions.slice(blankColumns).forEach((d, i) => {
            const offsetIndex = i + blankColumns;
            headerFooterDimensions[offsetIndex].total += parent0.dimensions[offsetIndex].value;
          });

          return [
            ...prev,
            parent0,
            ...quarters,
          ];
        }, [] as TaxDetailNode[]);

        return { nodes, maxDepth: 3, dimensions: headerFooterDimensions };
      })
    );
  constructor(
    protected override router: Router,
    protected override route: ActivatedRoute,
    protected override dataService: ReportDataService,
    private store: Store<AppState>,
  ) {
    super(dataService, router, route);
    this.fields[0].splice(1, 0, new SelectField({
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
    }));
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
