import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FieldBase, CheckboxField, DateField, InputField, SelectField, TextareaField} from 'dynamic-form';
import {UntypedFormGroup, Validators} from '@angular/forms';
import * as moment from 'moment';
import {EventService} from '../../services/event.service';
import {Employee, EmployeeEvent} from '../../../models/employee.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {isNotUndefined, zeroPad} from '../../util/functions';
import {eventTypes} from '../../../enums/store/selectors/enums.selectors';
import {EnumsActions} from '../../../enums/store/actions/action-types';
import {interval, Subject} from 'rxjs';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.scss']
})
export class AddEventComponent implements OnInit, OnDestroy {
  public form = new UntypedFormGroup({});
  public isProcessing = false;
  public model: {code?: number, message?: string, date?: moment.Moment, time?: string, now?: boolean} | undefined;
  public fields!: FieldBase<any>[][];
  private onDestroy$ = new Subject<void>();
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AddEventData,
    public dialogRef: MatDialogRef<AddEventComponent>,
    private eventService: EventService,
    private store: Store<AppState>,
  ) {
  }
  public ngOnInit() {
    const today = moment();
    this.fields = [
      [
        new SelectField({
          key: 'code',
          label: 'Event',
          options: this.store.select(eventTypes).pipe(
            tap((types) => {
              if (!types) {
                this.store.dispatch(EnumsActions.loadEnums({enumType: 'eventTypes'}));
              }
            }),
            filter(isNotUndefined)
          ),
          itemKey: 'code',
          displayField: 'description',
          required: true,
          disabled: !!this.data.model?.code,
        })
      ],
      [
        new TextareaField({
          key: 'message',
          label: 'Message',
          required: true,
          validators: [Validators.maxLength(255)],
          hint: { message: '255 chars max', align: 'start' },
        })
      ],
      [
        new CheckboxField({
          key: 'now',
          label: 'Now',
          value: true,
          onChange: (value, form) => {
            if (value) {
              form.controls['date'].disable();
              form.controls['time'].disable();
            } else {
              form.controls['date'].enable();
              form.controls['time'].enable();
            }
          }
        }),
        new DateField({
          key: 'date',
          label: 'Date',
          required: true,
          value: today,
          disabled: true,
        }),
        new InputField({
          type: 'time',
          label: 'Time',
          key: 'time',
          value: today.format('HH:mm'),
          required: true,
          disabled: true,
        })
      ]
    ];
    if (this.data.model) {
      const modelDate = this.data.model.whenCreated ? moment(this.data.model.whenCreated) : today;
      this.model = {
        code: this.data.model.code,
        message: this.data.model.message,
        date: modelDate,
        time: modelDate.format('HH:mm'),
        now: true,
      };
    }

    interval(1000).pipe(
      filter(() => (this.form.value as any).now),
      map(() => moment()),
      takeUntil(this.onDestroy$)
    )
      .subscribe((now) => this.form.patchValue({date: now, time: now.format('HH:mm')}));
  }
  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }

  public save(): void {
    const now = moment();
    const utcOffset = now.utcOffset();
    const formValue: any = this.form.getRawValue();
    const payload: Partial<EmployeeEvent> = {
      code: formValue.code,
      message: formValue.message,
      whenCreated: formValue.now ? undefined : `${moment(formValue.date).format('YYYY-MM-DD')}T${formValue.time}:00${utcOffset < 0 ? '' : '+'}${zeroPad(Math.floor(utcOffset / 60), 2) + ':' + zeroPad(utcOffset % 60, 2)}`,
    };
    this.form.disable();
    this.isProcessing = true;
    this.eventService.addForEmployee(this.data.employee.id, payload).subscribe(
      () => this.dialogRef.close(true),
      () => {
        this.form.enable();
        this.isProcessing = false;
      }
    );
  }
}

export interface AddEventData {
  employee: Employee;
  model?: Partial<EmployeeEvent>;
}
