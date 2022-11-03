import {Component} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {HandsetComponent} from '../handset-component';
import {SelectField} from 'dynamic-form';
import {map} from 'rxjs';

@Component({
  selector: 'app-select-survey',
  templateUrl: './select-survey.component.html',
  styleUrls: ['../styles.scss'],
})
export class SelectSurveyComponent extends HandsetComponent {
  public locationField = new SelectField({
    key: 'location',
    label: 'Location',
    options: this.route.data.pipe(map((data) => data['survey'].locations)),
    itemKey: 'id',
    displayField: 'name',
    onChange: (locationId) => this.router.navigate(['/survey', this.route.snapshot.data['survey'].id, locationId]),
  });
  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super(breakpointObserver);
  }
}
