import {Component} from '@angular/core';
import {SurveyService, Survey} from '../../survey.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HandsetComponent} from '../handset-component';
import {SelectField} from 'dynamic-form';
import {shareReplay, switchMap} from 'rxjs/operators';
import {map, filter} from 'rxjs';

@Component({
  selector: 'app-select-survey',
  templateUrl: './select-survey.component.html',
  styleUrls: ['../styles.scss'],
})
export class SelectSurveyComponent extends HandsetComponent {
  public surveys$ = this.dataService.get().pipe(shareReplay())
  public schema$ = this.surveys$.pipe(
    map((surveys) => surveys[0]),
    filter((survey): survey is Survey => !!survey),
    switchMap((survey) => this.dataService.getOneSchema(survey.schemaId)),
  );
  public locationField = new SelectField({
    key: 'location',
    label: 'Location',
    options: this.surveys$,
    itemKey: 'id',
    displayField: 'title',
    onChange: (surveyId) => this.router.navigate(['/survey', surveyId]),
  });
  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private dataService: SurveyService
  ) {
    super(breakpointObserver);
  }
}
