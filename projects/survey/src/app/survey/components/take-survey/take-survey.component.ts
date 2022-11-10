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
  takeUntil,
  ReplaySubject,
  interval, take, noop, of,
  debounceTime, first, forkJoin, tap, skip, distinctUntilChanged, catchError, throwError,
} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {SurveySchema, Survey, SurveyService, SurveyQuestion} from '../../survey.service';
import {ActivatedRoute, Router} from '@angular/router';
import {HandsetComponent} from '../handset-component';
import {shareReplay, switchMap} from 'rxjs/operators';
import {AbstractControl} from '@angular/forms';
import {MatStepper} from '@angular/material/stepper';
import {some, flatten, isEqual, omitBy} from 'lodash-es';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from 'shared-components';
import {NotificationsService} from 'notifications';
import * as moment from 'moment';
import {Title} from '@angular/platform-browser';

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
  public isSubmitting = false;
  public isCompleted = false;
  public isError = false;
  public reloadTimerValue: number | undefined;
  public readonly reloadTimerMax = 9;

  private onDestroy$ = new ReplaySubject<void>(1);

  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private notifications: NotificationsService,
    private titleService: Title,
    private dataService: SurveyService,
  ) {
    super(breakpointObserver);
  }

  public ngOnInit(): void {
    if (this.route.parent) {
      const sessionId = this.route.snapshot.queryParams['sessionId'];
      const progress$ = sessionId ? this.dataService.getProgress(sessionId) : of(null);
      const survey$ = this.route.parent.data.pipe(
        map((data) => data['survey']),
        shareReplay(),
      );
      const schema$ = survey$
        .pipe(
          filter((survey): survey is Survey => !!survey),
          switchMap((survey) => this.dataService.getSchema(survey.schemaId)),
          first(),
        );
      this.survey$ = survey$;
      this.schema$ = forkJoin([schema$, progress$])
        .pipe(
          tap(([schema, progress]) => {
            this.isError = false;
            this.isSubmitting = false;
            if (schema.steps[0]) {
              schema.steps[0].form.valueChanges.subscribe((value) => {
                const title = value.firstName && value.lastName ? `${concatName(value)} - Survey` : 'Survey';
                this.titleService.setTitle(title);
              });
            }
            schema.steps.forEach((step, index) => {
              if (progress) {
                setTimeout(() => {
                  const initialValue = {...step.form.value};
                  step.form.patchValue(progress, {emitEvent: true});
                  if (!isEqual(step.form.value, initialValue)) {
                    setTimeout(() => this.goToIndex(index, false, schema), 100);
                  }
                });
              }
              const onChange = schema.steps[index].onChange;
              step.form.valueChanges
                .pipe(
                  map(() => this.getAllFormValues(schema)),
                  tap((formValues) => {
                    if (onChange) {
                      const response = onChange(formValues);
                      if (response.modifyQuestions !== undefined) {
                        response.modifyQuestions.forEach((mod) => {
                          schema.steps[mod.stepIndex].questions[mod.questionIndex].question = mod.modifiedQuestion;
                          schema.steps[mod.stepIndex].questions = [...schema.steps[mod.stepIndex].questions];
                        });
                        setTimeout(() => step.form.patchValue({...progress, ...omitBy(step.form.value, (v) => v === undefined)}, {emitEvent: false}));
                      }
                    }
                  }),
                  skip(progress ? 1 : 0),
                  debounceTime(3000),
                  distinctUntilChanged(isEqual),
                  switchMap((formValues) => this.dataService.saveProgress(formValues, this.route.snapshot.queryParams['sessionId'])),
                  filter((res) => !!res),
                )
                .subscribe((res) => this.router.navigate([], {queryParams: {sessionId: res.sessionId}, queryParamsHandling: 'merge', replaceUrl: true}));
            });
          }),
          map(([schema, progress]) => schema),
          tap((x) => console.log(x)),
          catchError((err) => {
            this.isError = true;
            return throwError(err);
          })
        );
    }
  }

  public ngOnDestroy() {
    this.titleService.setTitle('Survey');
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
    const form = schema.steps[currentIndex].form;
    const step = schema.steps[currentIndex];
    const isValid = step.isValid ? step.isValid(form.value) : { valid: true };
    if (isValid.valid && form.valid) {
      step.completed = true;
      schema.steps.slice(currentIndex + 1).forEach((s) => {
        s.skipped = false;
        s.completed = false;
      });
      if (step.onNext) {
        const onNext = step.onNext(this.getAllFormValues(schema));
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
    const payload = this.getAllFormValues(schema);

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
    delete payload.time1;
    delete payload.time2;
    delete payload.time3;

    this.isSubmitting = true;
    this.dataService.submit(
      payload,
      this.route.snapshot.params['surveyId'],
      this.route.snapshot.params['locationId'],
      this.route.snapshot.queryParams['nomail'] === 'true'
    )
      .subscribe((res) => {
        this.router.navigate([], {queryParams: {sessionId: null}, queryParamsHandling: 'merge', replaceUrl: true});
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
                this.reload();
              }
            });
        }
      }, () => this.isSubmitting = false);
  }

  public reload(): void {
    this.router.navigate([], {queryParams: {sessionId: null}, replaceUrl: true, queryParamsHandling: 'merge'})
      .then(() => window.location.reload());
  }

  private goToIndex(index: number, skip: boolean, schema: SurveySchema): void {
    schema.steps.slice(this.stepperRef.selectedIndex, index).forEach((step, i) => {
      step.completed = true
      step.skipped = i !== 0 && skip;
    });
    setTimeout(() => this.stepperRef.selectedIndex = index);
  }

  private getAllFormValues(schema: SurveySchema): any {
    return schema.steps.reduce((prev, curr) => ({...prev, ...curr.form.value}), {});
  }
}

function concatName(entity: {firstName: string, middleName?: string, lastName: string}): string {
  return `${entity.firstName} ${entity.middleName ? entity.middleName + ' ' : ''}${entity.lastName}`;
}
