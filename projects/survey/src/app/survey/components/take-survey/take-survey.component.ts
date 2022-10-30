import {Component, OnInit, OnDestroy} from '@angular/core';
import {Observable} from 'rxjs';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Survey} from '../../survey.service';
import {ActivatedRoute} from '@angular/router';
import {HandsetComponent} from '../../handset-component';

@Component({
  selector: 'app-take-survey',
  templateUrl: './take-survey.component.html',
  styleUrls: ['../styles.scss'],
})
export class TakeSurveyComponent extends HandsetComponent implements OnInit, OnDestroy {
  public isSubmitting = false;
  public survey$!: Observable<Survey>;

  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
  ) {
    super(breakpointObserver);
  }

  public ngOnInit(): void {

  }

  public ngOnDestroy() {

  }
}
