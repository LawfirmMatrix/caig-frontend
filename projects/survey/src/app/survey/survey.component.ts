import {Component, OnInit, OnDestroy} from '@angular/core';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {takeUntil, ReplaySubject} from 'rxjs';
import {Survey} from './survey.service';

@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.scss']
})
export class SurveyComponent implements OnInit, OnDestroy {
  private onDestroy$ = new ReplaySubject<void>();

  public isHandset = this.breakpointObserver.isMatched(Breakpoints.Handset);
  public isSubmitting = false;

  public survey: Survey | undefined;

  constructor(private breakpointObserver: BreakpointObserver) { }

  public ngOnInit(): void {
    this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(takeUntil(this.onDestroy$))
      .subscribe(({matches}) => this.isHandset = matches);
  }

  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }
}
