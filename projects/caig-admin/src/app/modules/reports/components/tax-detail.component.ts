import {ReportDataService} from '../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';
import {map, switchMap} from 'rxjs/operators';
import {startWith, debounceTime} from 'rxjs';
import {TableColumn} from 'vs-table';
import {TaxDetail} from '../../../models/tax-detail.model';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, DateRangeField, CheckboxField} from 'dynamic-form';
import {QueryParams} from '@ngrx/data';

export abstract class TaxDetailComponent<T extends TaxDetail> {
  public abstract columns: TableColumn<T>[];
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
        ...this.modelParams(qp),
      }))
    );
  public data$ = this.model$
    .pipe(
      switchMap((model) =>
        this.dataService.taxDetail(model.dates.start, model.dates.end, model.allSettlements)
          .pipe(
            map((data) => data.map((row) => ({...row, _state: row.state, _totalBp: row.totalBp}))),
            startWith(null)
          )
      ),
      startWith([]),
    );
  constructor(
    protected dataService: ReportDataService,
    protected router: Router,
    protected route: ActivatedRoute,
  ) {
    this.form.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        const queryParams = {
          fromDate: value.dates.start,
          toDate: value.dates.end,
          ...this.modelForm(value),
        };
        this.router.navigate([], {queryParams, queryParamsHandling: 'merge', replaceUrl: true});
      });
  }
  protected modelForm(formValue: any): any {
    return { allSettlements: formValue.allSettlements };
  }
  protected modelParams(queryParams: QueryParams): any {
    return {
      allSettlements: queryParams['allSettlements'] === 'true',
    };
  }
  public viewEmployee(employeeId: number): void {
    this.router.navigate(['/employees', employeeId, 'view']);
  }
}
