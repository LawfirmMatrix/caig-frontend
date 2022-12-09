import {Component, OnInit} from '@angular/core';
import {TableColumn, CalculateColumn, TextColumn, CurrencyColumn} from 'vs-table';
import {ReportDataService} from '../../services/report-data.service';
import {TaxDetail} from '../../../../models/tax-detail.model';
import {map, switchMap} from 'rxjs/operators';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, DateRangeField, CheckboxField} from 'dynamic-form';
import {Router, ActivatedRoute} from '@angular/router';
import {startWith, debounceTime} from 'rxjs';

@Component({
  selector: 'app-tax-info',
  templateUrl: './tax-info.component.html',
  styleUrls: ['./tax-info.component.scss']
})
export class TaxInfoComponent implements OnInit {
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
  public columns: TableColumn<TaxDetailTableItem>[] = [
    new CalculateColumn({
      title: 'SSN',
      field: 'ssn',
      calculate: (row) => row.ssn || 'ENCRYPTED',
    }),
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
    new TextColumn({
      title: 'Address',
      field: 'address',
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
    new CurrencyColumn({
      title: 'Damages (1099)',
      field: 'totalLd',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Wages (1)',
      field: 'totalBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Fed Tax (2)',
      field: 'fedTaxes',
      negateValue: true,
      sum: true,
    }),
    new CurrencyColumn({
      title: 'SS Wages (3)',
      field: 'ssWages',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'SS Withheld (4)',
      field: 'employeeSs',
      negateValue: true,
      sum: true,
    }),
    new CurrencyColumn({
      title: 'MC Wages (5)',
      field: 'mcWages',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'MC Withheld (6)',
      field: 'employeeMc',
      negateValue: true,
      sum: true,
    }),
    new TextColumn({
      title: 'State (15)',
      field: '_state',
      fxLayoutAlign: 'end center',
    }),
    new CurrencyColumn({
      title: 'State Wages (16)',
      field: '_totalBp',
      sum: true,
    }),
    new CurrencyColumn({
      title: 'State Withheld (17)',
      field: 'stateTaxes',
      negateValue: true,
      sum: true,
    }),
    new CurrencyColumn({
      title: 'Cost Share',
      field: 'costShare',
      negateValue: true,
      sum: true,
    })
  ];
  public model$ = this.route.queryParams
    .pipe(
      map((qp) => ({
        dates: {
          start: qp['fromDate'],
          end: qp['toDate'],
        },
        allSettlements: !!qp['allSettlements'],
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
    private dataService: ReportDataService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }
  public ngOnInit() {
    this.form.valueChanges
      .pipe(debounceTime(100))
      .subscribe((value) => {
        const queryParams = { fromDate: value.dates.start, toDate: value.dates.end, allSettlements: value.allSettlements };
        this.router.navigate([], {queryParams, queryParamsHandling: 'merge', replaceUrl: true});
      });
  }
  public viewEmployee(employeeId: number): void {
    this.router.navigate(['/employees', employeeId, 'view']);
  }
}

interface TaxDetailTableItem extends TaxDetail {
  _state: string;
  _totalBp: number;
}
