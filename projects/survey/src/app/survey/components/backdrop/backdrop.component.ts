import {Component, OnInit} from '@angular/core';
import {HandsetComponent} from '../handset-component';
import {switchMap} from 'rxjs/operators';
import {map, filter, Observable, combineLatest, BehaviorSubject} from 'rxjs';
import {Survey, SurveyDataService, SurveySchema, SurveyLocation} from '../../survey-data.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['../styles.scss']
})
export class BackdropComponent extends HandsetComponent implements OnInit {
  public survey$: Observable<Survey | undefined> = this.route.data.pipe(map((data) => data['survey']));
  public schema$: Observable<SurveySchema> = this.survey$
    .pipe(
      filter((survey): survey is Survey => !!survey),
      switchMap((survey) => this.dataService.getSchema(survey.schemaId))
    );
  public location$!: Observable<SurveyLocation | undefined>;
  private locationId$!: BehaviorSubject<string | undefined>;
  private get locationId(): string | undefined {
    return this.route.firstChild?.snapshot.params['locationId'];
  }
  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private dataService: SurveyDataService,
    private route: ActivatedRoute,
  ) {
    super(breakpointObserver);
  }
  public ngOnInit() {
    this.locationId$ = new BehaviorSubject(this.locationId);
    this.location$ = combineLatest([this.locationId$, this.survey$])
      .pipe(
        map(([locationId, survey]) => survey?.locations.find((l) => l.id === locationId)),
      );
  }
  public onActivate(event: any): void {
    this.locationId$.next(this.locationId);
  }
}
