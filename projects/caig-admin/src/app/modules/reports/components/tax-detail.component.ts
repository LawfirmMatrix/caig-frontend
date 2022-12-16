import {ReportDataService} from '../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {map, switchMap, shareReplay} from 'rxjs/operators';
import {startWith, debounceTime, distinctUntilChanged, skip} from 'rxjs';
import {TaxDetail} from '../../../models/tax-detail.model';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, DateRangeField, CheckboxField} from 'dynamic-form';
import {isEqual} from 'lodash-es';

export abstract class TaxDetailComponent<T extends TaxDetail> {
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new DateRangeField({
        key: 'dates',
        label: 'Date range',
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
      debounceTime(100),
      map((qp) => ({
        dates: {
          start: qp['fromDate'],
          end: qp['toDate'],
        },
        allSettlements: qp['allSettlements'] === 'true',
        state: qp['state'],
      })),
      shareReplay(),
    );
  public data$ = this.model$
    .pipe(
      switchMap((model) =>
        this.dataService.taxDetail(model.dates.start, model.dates.end, model.allSettlements, model.state)
          .pipe(
            map((data) => data.map((row) => ({...row, _state: row.state, _totalBp: row.totalBp}))),
            startWith(null)
          )
      ),
      startWith([]),
      shareReplay(),
    );
  constructor(
    protected dataService: ReportDataService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
    this.form.valueChanges
      .pipe(
        debounceTime(100),
        distinctUntilChanged(isEqual),
        skip(1),
      )
      .subscribe((value) => {
        const queryParams = {
          fromDate: value.dates.start,
          toDate: value.dates.end,
          allSettlements: value.allSettlements,
          state: value.state,
        };
        this.router.navigate([], {queryParams, queryParamsHandling: 'merge', replaceUrl: true});
      });
    this.model$.subscribe((model) => this.form.patchValue(model));
  }
  public viewEmployee(employeeId: number): void {
    this.router.navigate(['/employees', employeeId, 'view']);
  }
}
