import {ReportDataService} from '../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {map, switchMap, shareReplay} from 'rxjs/operators';
import {startWith, debounceTime, distinctUntilChanged, skip, Observable} from 'rxjs';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, DateRangeField, CheckboxField} from 'dynamic-form';
import {isEqual} from 'lodash-es';
import {coerceBooleanProperty} from "@angular/cdk/coercion";
import {TaxDetail} from '../../../models/tax-detail.model';

export abstract class TaxDetailComponent {
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
        value: true,
        position: 'start',
      }),
    ]
  ];
  public model$ = this.route.queryParams
    .pipe(
      debounceTime(100),
      map((qp) => {
        const allSettlementsKey = 'allSettlements';
        return {
          dates: {
            start: qp['fromDate'],
            end: qp['toDate'],
          },
          allSettlements: !qp[allSettlementsKey] || coerceBooleanProperty(qp[allSettlementsKey]),
          state: qp['state'],
          includeSsn: qp['includeSsn'] === 'true',
        };
      }),
      shareReplay(),
    );
  public data$: Observable<TaxDetail[] | null> = this.model$
    .pipe(
      switchMap((model) =>
        this.dataService.taxDetail(model.dates.start, model.dates.end, model.allSettlements, model.state, model.includeSsn)
          .pipe(startWith(null))
      ),
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
