import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Survey} from '../../survey.service';
import {ActivatedRoute, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HandsetComponent} from '../../handset-component';
import {SelectField} from 'dynamic-form';

@Component({
  selector: 'app-select-survey',
  templateUrl: './select-survey.component.html',
  styleUrls: ['../styles.scss'],
})
export class SelectSurveyComponent extends HandsetComponent implements OnInit, OnDestroy {
  public surveys$!: Observable<Survey[]>;
  public locationField = new SelectField({
    key: 'location',
    label: 'Location',
    options: of([
      { name: 'Bedford', id: 8, },
      { name: 'Boston/Brockton', id: 9 },
      { name: 'Butler', id: 7 },
      { name: 'Charleston', id: 10 },
      { name: 'Coatesville', id: 5 },
      { name: 'Grand Junction', id: 11 },
      { name: 'Hampton', id: 12 },
      { name: 'Lexington', id: 6 },
      { name: 'Manchester', id: 13 },
      { name: 'Martinsburg', id: 2 },
      { name: 'Memphis', id: 14 },
      { name: 'Newington', id: 15 },
      { name: 'Northampton', id: 16 },
      { name: 'Topeka', id: 18 },
      { name: 'West Roxbury', id: 17 },
    ]),
    itemKey: 'id',
    displayField: 'name',
    onChange: (surveyId) => this.router.navigate(['/survey', surveyId]),
  });

  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    super(breakpointObserver);
  }

  public ngOnInit() {

  }

  public ngOnDestroy() {

  }
}
