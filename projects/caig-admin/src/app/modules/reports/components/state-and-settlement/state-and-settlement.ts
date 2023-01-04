import {TableColumn, TextColumn, CurrencyColumn, CalculateColumn} from 'vs-table';
import {TaxDetailComponent} from '../tax-detail.component';
import {ReportDataService} from '../../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable, startWith, BehaviorSubject, combineLatest} from 'rxjs';
import {switchMap, shareReplay, map} from 'rxjs/operators';
import {statesMap} from '../../../../core/util/consts';
import {StateWithDetail} from '../../../../models/tax-detail.model';

export abstract class StateAndSettlement extends TaxDetailComponent {
  protected abstract valueField: 'totalBp' | 'stateTaxes';
  public rowView$ = new BehaviorSubject<'settlement' | 'state'>('settlement');
  public override data$: Observable<any[] | null> = combineLatest([
    this.rowView$,
    this.model$
      .pipe(
        switchMap((model) =>
          this.dataService.stateTaxDetail(model.dates.start, model.dates.end)
            .pipe(startWith(null))
        ),
        shareReplay(),
      )
  ])
    .pipe(
      map(([rowView, data]) => {
        if (!data?.length) {
          return data;
        }
        switch (rowView) {
          case 'settlement':
            return data.map((settlement) => ({
              ...settlement,
              ...settlement.states.reduce((prev, curr) => ({
                ...prev,
                [curr.state + this.valueField]: curr[this.valueField]
              }), {}),
            }));
          case 'state':
            return data[0].states.map((state, index) => ({
              ...state,
              ...data.reduce((prev, curr) => ({
                ...prev,
                [curr.settlementCode + this.valueField]: curr.states[index][this.valueField],
              }), {}),
              settlements: data.map((s) => s.settlementCode),
            }));
        }
      })
    );
  public columns$: Observable<TableColumn<any>[]> = this.data$
    .pipe(
      map((data) => {
        if (!data?.length) {
          return [];
        }
        const rowView = data[0].settlementCode ? 'settlement' : 'state';
        switch (rowView) {
          case 'settlement':
            const columns: TableColumn<any>[] = [
              new TextColumn({
                title: 'Settlement',
                field: 'settlementCode',
              }),
            ];
            data[0].states.forEach((state: StateWithDetail) => columns.push(new CurrencyColumn({
              title: `${state.state} - ${statesMap[state.state]}`,
              field: state.state + this.valueField,
              sum: true,
            })));
            return columns;
          case 'state':
            const cols: TableColumn<any>[] = [
              new CalculateColumn({
                title: 'State',
                field: 'state',
                calculate: (row) => `${row.state} - ${statesMap[row.state]}`,
              })
            ];
            data[0].settlements.forEach((settlementCode: string) => cols.push(new CurrencyColumn({
              title: settlementCode,
              field: settlementCode + this.valueField,
              sum: true,
            })));
            return cols;
          default:
            return [];
        }
      }),
      startWith([]),
    );
  constructor(
    protected override dataService: ReportDataService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(dataService, router, route);
    this.fields[0].pop();
  }
}
