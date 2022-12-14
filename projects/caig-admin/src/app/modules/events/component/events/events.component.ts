import {Component, OnInit} from '@angular/core';
import {UntypedFormGroup} from '@angular/forms';
import {FieldBase, DateRangeField, SelectField} from 'dynamic-form';
import {combineLatest, Observable, first} from 'rxjs';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {isAdmin, settlementId, portal} from '../../../../core/store/selectors/core.selectors';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {GeneralEvent} from '../../../../models/employee.model';
import {EventService} from '../../../../core/services/event.service';
import {ChangesColumn, DateColumn, TableColumn, TextColumn} from 'vs-table';
import * as moment from 'moment';
import {mapNumberArrToModel} from '../../../employees/components/employees-list/employees-list.component';
import {eventTypes} from '../../../../enums/store/selectors/enums.selectors';
import {isNotUndefined} from '../../../../core/util/functions';
import {isEqual} from 'lodash-es';
import {usersForSettlement} from '../../../users/store/selectors/user.selectors';
import {Portal} from '../../../../models/session.model';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  public form = new UntypedFormGroup({});
  public fields$: Observable<FieldBase<any>[][]> = this.store.select(isAdmin)
    .pipe(
      map((isAdmin) => {
        const fields: FieldBase<any>[][] = [
          [
            new DateRangeField({
              key: 'dates',
              label: 'Date Range',
              startPlaceholder: 'From:',
              endPlaceholder: 'To:',
              fxFlex: isAdmin ? undefined : 10,
            }),
          ],
          [
            new SelectField({
              key: 'code',
              label: 'Type(s)',
              options: this.store.select(eventTypes).pipe(filter(isNotUndefined)),
              itemKey: 'code',
              displayField: 'description',
              multiple: true,
            }),
          ]
        ];
        if (isAdmin) {
          fields[0].push(new SelectField({
            key: 'userId',
            label: 'User(s)',
            options: this.store.select(usersForSettlement).pipe(filter(isNotUndefined)),
            itemKey: 'id',
            displayField: 'username',
            multiple: true,
          }));
        }
        return fields;
      })
    );
  public columns: TableColumn<GeneralEvent>[] = [
    new TextColumn({
      title: 'Employee',
      field: 'employeeName',
    }),
    new DateColumn({
      title: 'Date',
      field: 'whenCreated',
      format: 'short',
    }),
    new TextColumn({
      title: 'Message',
      field: 'message',
    }),
    new TextColumn({
      title: 'Type',
      field: 'description',
    }),
    new TextColumn({
      title: 'User',
      field: 'user',
    }),
    new ChangesColumn({
      title: 'Changes',
      field: 'changes',
    }),
  ];
  public events$!: Observable<GeneralEvent[] | null>;
  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: EventService,
  ) {
  }
  public ngOnInit() {
    const queryParams$ = this.route.queryParams.pipe(
      debounceTime(200),
      distinctUntilChanged(isEqual),
    );

    queryParams$.subscribe((queryParams) => {
      const formModel = {
        dates: {
          start: queryParams.fromDate ? moment(queryParams.fromDate) : moment().subtract(1, 'months'),
          end: queryParams.toDate ? moment(queryParams.toDate) : null,
        },
        code: mapNumberArrToModel(queryParams, 'code'),
        userId: mapNumberArrToModel(queryParams, 'userId'),
      };
      this.form.patchValue(formModel);
    });

    this.events$ = combineLatest([queryParams$, this.store.select(settlementId)])
      .pipe(
        switchMap(([qp,]) => this.dataService.get(qp).pipe(startWith(null)))
      );

    this.form.valueChanges
      .pipe(
        map((value: any) => ({
          ...value,
          toDate: moment.isMoment(value.dates.end) ? value.dates.end.format('YYYY-MM-DD') : value.dates.end,
          fromDate: moment.isMoment(value.dates.start) ? value.dates.start.format('YYYY-MM-DD') : value.dates.start,
          dates: undefined,
        })),
      )
      .subscribe((queryParams) => this.router.navigate([], {queryParams, replaceUrl: true}));
  }
  public viewEmployee(id: number): void {
    this.store.select(portal)
      .pipe(first())
      .subscribe((portal) => {
        const baseUrl = portal === Portal.CallCenter ? 'call-list' : 'employees';
        this.router.navigate([`/${baseUrl}`, id, 'view']);
      });
  }
}
