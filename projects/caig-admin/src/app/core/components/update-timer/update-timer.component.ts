import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppData} from '../../../models/app-data.model';
import {VersionReadyEvent} from '@angular/service-worker';
import {interval, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-update-timer',
  templateUrl: './update-timer.component.html',
  styleUrls: ['./update-timer.component.scss'],
})
export class UpdateTimerComponent implements OnInit {
  @Input() public updateEvent!: VersionReadyEvent;
  @Input() public disabled!: boolean;
  @Output() public installUpdate = new EventEmitter<void>();

  public showSeconds = false;
  public duration!: number;

  private readonly onDestroy$ = new Subject<void>();

  public ngOnInit(): void {
    const appData = this.updateEvent.latestVersion.appData as AppData;
    const minutes = appData.forceReloadDuration || 0;
    if (minutes) {
      const startTime = moment();
      const duration = minutes / 60;
      this.duration = duration;
      interval(950)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => {
          const now = moment();
          const diff = now.diff(startTime, 'hours', true);
          this.duration = duration - diff;
          if (this.duration < 0.0003) {
            this.duration = 0;
            this.onDestroy$.next(void 0);
            this.installUpdate.emit(void 0);
          }
        });
    }
  }

  public ngOnDestroy(): void {
    this.onDestroy$.next(void 0);
  }
}
