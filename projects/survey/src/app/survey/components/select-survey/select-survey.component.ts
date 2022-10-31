import {Component} from '@angular/core';
import {SurveyService} from '../../survey.service';
import {Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HandsetComponent} from '../handset-component';
import {SelectField} from 'dynamic-form';

@Component({
  selector: 'app-select-survey',
  templateUrl: './select-survey.component.html',
  styleUrls: ['../styles.scss'],
})
export class SelectSurveyComponent extends HandsetComponent {
  public locationField = new SelectField({
    key: 'location',
    label: 'Location',
    options: this.dataService.get(),
    itemKey: 'id',
    displayField: 'title',
    onChange: (surveyId) => this.router.navigate(['/survey', surveyId]),
  });
  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private router: Router,
    private dataService: SurveyService
  ) {
    super(breakpointObserver);
  }
}
