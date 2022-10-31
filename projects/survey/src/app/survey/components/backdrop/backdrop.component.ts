import {Component, OnInit} from '@angular/core';
import {HandsetComponent} from '../handset-component';
import {shareReplay, switchMap} from 'rxjs/operators';
import {map, filter} from 'rxjs';
import {Survey, SurveyService} from '../../survey.service';
import {BreakpointObserver} from '@angular/cdk/layout';
import {TakeSurveyComponent} from '../take-survey/take-survey.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-backdrop',
  templateUrl: './backdrop.component.html',
  styleUrls: ['../styles.scss']
})
export class BackdropComponent extends HandsetComponent implements OnInit {
  public surveys$ = this.dataService.get().pipe(shareReplay())
  public schema$ = this.surveys$.pipe(
    map((surveys) => surveys[0]),
    filter((survey): survey is Survey => !!survey),
    switchMap((survey) => this.dataService.getOneSchema(survey.schemaId)),
  );
  public showLocation!: boolean;
  constructor(
    protected override breakpointObserver: BreakpointObserver,
    private dataService: SurveyService,
    private route: ActivatedRoute,
  ) {
    super(breakpointObserver);
  }
  public ngOnInit() {
    this.showLocation = !!this.route.firstChild?.snapshot.params['id'];
  }
  public onActivate(event: any): void {
    this.showLocation = event instanceof TakeSurveyComponent;
  }
}
