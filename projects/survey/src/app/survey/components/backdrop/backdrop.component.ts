import {Component, OnInit} from '@angular/core';
import {HandsetComponent} from '../handset-component';
import {shareReplay, switchMap} from 'rxjs/operators';
import {map, filter, BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {Survey, SurveyService, SurveySchema} from '../../survey.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TakeSurveyComponent} from '../take-survey/take-survey.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['../styles.scss']
})
export class BackdropComponent extends HandsetComponent implements OnInit {
  private static readonly SURVEY_ID = 'id';
  public surveyId$ = new BehaviorSubject<string | undefined>(undefined);
  public schema$!: Observable<SurveySchema>;
  public showLocation!: boolean;
  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private dataService: SurveyService,
    private route: ActivatedRoute,
  ) {
    super(breakpointObserver);
  }
  public ngOnInit() {
    const surveys$ = this.dataService.get().pipe(shareReplay());
    this.schema$ = combineLatest([surveys$, this.surveyId$])
      .pipe(
        map(([surveys, surveyId]) => {
          if (!surveyId) {
            return surveys[0];
          }
          return surveys.find((s) => s.id === surveyId);
        }),
        filter((survey): survey is Survey => !!survey),
        switchMap((survey) => this.dataService.getOneSchema(survey.schemaId))
      );
    this.showLocation = !!this.route.firstChild?.snapshot.params[BackdropComponent.SURVEY_ID];
  }
  public onActivate(event: any): void {
    this.showLocation = event instanceof TakeSurveyComponent;
    this.surveyId$.next(this.route.firstChild?.snapshot.params[BackdropComponent.SURVEY_ID]);
  }
}
