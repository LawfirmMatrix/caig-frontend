import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
} from '@angular/core';
import {
  Observable,
  map,
  filter,
  catchError,
  throwError,
  timer,
  takeUntil,
  ReplaySubject,
  tap, interval, take, noop
} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {SurveySchema, Survey, SurveyService, SurveyQuestion} from '../../survey.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HandsetComponent} from '../handset-component';
import {switchMap} from 'rxjs/operators';
import {UntypedFormGroup, AbstractControl} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {some, flatten} from 'lodash-es';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'shared-components';
import {NotificationsService} from 'notifications';
import * as moment from 'moment';

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['../styles.scss', './take-survey.component.scss'],
})
export class TakeSurveyComponent extends HandsetComponent implements OnInit, OnDestroy {
  @ViewChild(MatStepper) public stepperRef!: MatStepper;
  @ViewChildren('title') public titles!: QueryList<ElementRef>;

  public survey$!: Observable<Survey>;
  public schema$!: Observable<SurveySchema>;
  public forms!: UntypedFormGroup[];
  public isSubmitting = false;
  public isCompleted = false;
  public isError = false;
  public nextSurvey: SurveySchema | undefined;
  public reloadTimerValue: number | undefined;
  public readonly reloadTimerMax = 9;

  private onDestroy$ = new ReplaySubject<void>(1);

  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private dataService: SurveyService,
    private router: Router,
    private dialog: MatDialog,
    private notifications: NotificationsService,
  ) {
    super(breakpointObserver);
  }

  public ngOnInit(): void {
    if (this.route.parent) {
      this.survey$ = this.route.parent.data.pipe(map((data) => data['survey']));
      this.schema$ = this.survey$
        .pipe(
          filter((survey): survey is Survey => !!survey),
          switchMap((survey) => this.dataService.getSchema(survey.schemaId)),
          tap((schema) => {
            this.forms = schema.steps.map(() => new UntypedFormGroup({}));
            this.isError = false;
            this.isSubmitting = false;
          }),
          catchError((err) => {
            this.isError = true;
            return throwError(err);
          }),
        );

      // @TODO - handle respondentId and schemaId queryparams for nextSurvey


      // @TODO - handle handset fields

      // @TODO - handle responsive questions

    }
  }

  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }

  public scrollToTitle(currentIndex: number): void {
    if (currentIndex) {
      this.titles.get(currentIndex)?.nativeElement.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'start'});
    }
  }

  public isTouched(question: SurveyQuestion, controls: {[key: string]: AbstractControl}): boolean {
    return some(flatten(question.fields), (field) => controls[field.key]?.touched);
  }

  public back(stepper: MatStepper, schema: SurveySchema): void {
    stepper.previous();
    if (schema.steps[stepper.selectedIndex].skipped) {
      this.back(stepper, schema);
    }
  }

  public reset(stepper: MatStepper): void {
    const title = 'Reset Survey';
    const text = 'Are you sure you want to start over?';
    this.dialog.open(ConfirmDialogComponent, { data: { title, text }})
      .afterClosed()
      .pipe(filter((res) => !!res))
      .subscribe(() => this.reload());
  }

  public next(stepper: MatStepper, schema: SurveySchema): void {
    const currentIndex = stepper.selectedIndex;
    const form = this.forms[currentIndex];
    const step = schema.steps[currentIndex];
    const isValid = step.isValid ? step.isValid(form.value) : { valid: true };
    if (isValid.valid && form.valid) {
      step.completed = true;
      schema.steps.slice(currentIndex + 1).forEach((s) => {
        s.skipped = false;
        s.completed = false;
      });
      if (step.onNext) {
        const onNext = step.onNext(this.getAllFormValues());
        if (onNext.skipToStepIndex !== undefined) {
          this.goToIndex(onNext.skipToStepIndex, true, schema);
          return;
        }
      }
      stepper.next();
    } else {
      this.notifications.showSimpleErrorMessage(isValid.errorMessage || 'Please complete the required form fields.');
      form.markAllAsTouched();
    }
  }

  public submit(schema: SurveySchema): void {
    const payload = this.getAllFormValues();

    if (payload.followUp !== false) {
      payload.followUp = true;
      // @TODO - create DateTime field?
      if (!payload.followUpAnytime) {
        payload.dateTime1 = payload.date1 && payload.time1 ? moment(`${payload.date1} ${payload.time1}`).format('YYYY-MM-DDTHH:mm:ss') : undefined;
        payload.dateTime2 = payload.date2 && payload.time2 ? moment(`${payload.date2} ${payload.time2}`).format('YYYY-MM-DDTHH:mm:ss') : undefined;
        payload.dateTime3 = payload.date3 && payload.time3 ? moment(`${payload.date3} ${payload.time3}`).format('YYYY-MM-DDTHH:mm:ss') : undefined;
      }
    }

    if (payload.startBeforeDate) {
      payload.uncertainStartDate = payload.startBeforeDate === '0';
      delete payload.startMonth;
      delete payload.startYear;
      delete payload.startBeforeDate;
    }

    if (payload.startMonth && payload.startYear) {
      payload.startMonth = Number(payload.startMonth);
      payload.startYear = Number(payload.startYear);
    }

    if (payload.endMonth) {
      payload.endMonth = Number(payload.endMonth);
    }
    if (payload.endYear) {
      payload.endYear = Number(payload.endYear);
    }

    delete payload.followUpAnytime;
    delete payload.date1;
    delete payload.date2;
    delete payload.date3;
    delete payload.month1;
    delete payload.month2;
    delete payload.month3;
    delete payload.day1;
    delete payload.day2;
    delete payload.day3;
    delete payload.time1;
    delete payload.time2;
    delete payload.time3;

    this.nextSurvey = schema.nextSurvey ? schema.nextSurvey(payload) : undefined;

    this.isSubmitting = true;
    this.dataService.submit(
      payload,
      this.route.snapshot.params['surveyId'],
      this.route.snapshot.params['locationId'],
      this.route.snapshot.queryParams['respondentId'],
      this.route.snapshot.queryParams['nomail'] === 'true'
    )
      .subscribe((res) => {
        this.isSubmitting = false;
        this.isCompleted = true;
        if (this.route.snapshot.queryParams['reload'] === 'true') {
          const intv = 200;
          const count = (this.reloadTimerMax * 1000) / intv;
          interval(intv).pipe(
            map((i => (i + 1) * (100 / count))),
            take(count),
            takeUntil(this.onDestroy$),
          )
            .subscribe((value) => this.reloadTimerValue = value, noop, () => {
              if (this.reloadTimerValue === 100) {
                this.reload(res.id);
              }
            });
        }
      }, () => this.isSubmitting = false);
  }

  public reload(id?: string): void {
    const respondentId = this.nextSurvey ? id : null;
    const schemaId = this.nextSurvey ? this.nextSurvey.id : null;
    this.router.navigate([], {queryParams: {sessionId: null, respondentId, schemaId}, queryParamsHandling: 'merge'})
      .then(() => window.location.reload());
  }

  private goToIndex(index: number, skip: boolean, schema: SurveySchema): void {
    schema.steps.slice(this.stepperRef.selectedIndex, index).forEach((step, i) => {
      step.completed = true
      step.skipped = i !== 0 && skip;
    });
    setTimeout(() => this.stepperRef.selectedIndex = index);
  }

  private getAllFormValues(): any {
    return this.forms.reduce((prev, curr) => ({...prev, ...curr.value}), {});
  }
}
