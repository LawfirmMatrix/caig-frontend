import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AppDataChanges} from '../../../models/app-data.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {isSuperAdmin, portal} from '../../store/selectors/core.selectors';
import {combineLatest, Observable, filter} from 'rxjs';
import {map} from 'rxjs/operators';
import {isNotUndefined} from '../../util/functions';
import {pick} from 'lodash-es';

@Component({
  selector: 'app-whats-new',
  templateUrl: './whats-new.component.html',
  styleUrls: ['./whats-new.component.scss']
})
export class WhatsNewComponent implements OnInit {
  public changes$!: Observable<AppDataChanges>;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AppDataChanges,
    public dialogRef: MatDialogRef<WhatsNewComponent>,
    private store: Store<AppState>,
  ) { }
  public ngOnInit() {
    const isSuperAdmin$ = this.store.select(isSuperAdmin).pipe(filter(isNotUndefined));
    const portal$ = this.store.select(portal).pipe(filter(isNotUndefined));
    this.changes$ = combineLatest([isSuperAdmin$, portal$])
      .pipe(
        map(([isSuperAdmin, portal]) => isSuperAdmin ? this.data : pick(this.data, ['General', portal])),
      );
  }
}
