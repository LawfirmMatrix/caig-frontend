import {BehaviorSubject, Observable, combineLatest, of, filter, Subject, debounceTime, noop} from 'rxjs';
import {map, switchMap, shareReplay} from 'rxjs/operators';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {NgxCsvService} from 'export-csv';
import {Survey} from '../../../../models/survey.model';
import {Respondent} from '../../../../models/respondent.model';
import {RespondentDataService} from '../../services/respondent-data.service';
import {formatDateTime} from '../../../../core/util/functions';
import {FieldBase, RadioField} from 'dynamic-form';
import {TableColumn, RowMenuItem, VsTableComponent} from 'vs-table';
import {AttachFilesComponent} from '../../../../core/components/attach-files/attach-files.component';
import {
  ViewAttachedFilesComponent
} from '../../../../core/components/view-attached-files/view-attached-files.component';
import {EditNotesComponent} from '../edit-notes/edit-notes.component';
import {forIn, flatten} from 'lodash-es';
import {ConfirmDialogData, ConfirmDialogComponent} from 'shared-components';
import {ColumnConfigService} from './column-config.service';

export abstract class RespondentsList {
  private static readonly DEFAULT_STATUS = 'all';
  private static readonly DEFAULT_VIEW = 'bue';
  private static readonly STATUS_PARAM = 'status';
  private static readonly VIEW_MODE_PARAM = 'viewMode';
  private static readonly SURVEY_ID_PARAM = 'surveyId';
  private static readonly LOCATION_ID_PARAM = 'locationId';

  public abstract table: VsTableComponent<RespondentFlat>;

  protected refreshRespondents$ = new BehaviorSubject<void>(void 0);

  public survey!: Survey;

  protected params$ = this.route.params.pipe(
    map((qp) => {
      const locationId = qp[RespondentsList.LOCATION_ID_PARAM];
      return locationId ? { locationId } : { surveyId: qp[RespondentsList.SURVEY_ID_PARAM] };
    })
  );

  public location$ = this.params$.pipe(
    map((params) => this.survey.locations?.find((l) => l.id === params.locationId))
  );

  public respondents$: Observable<RespondentFlat[]> =
    combineLatest([this.refreshRespondents$, this.params$])
      .pipe(
        switchMap(([, params]) => this.dataService.get(params)),
        map((data) => data.map(this.sanitizeRespondent)),
        shareReplay(),
      );

  public formFields: FieldBase<any>[][] = [
    [
      new RadioField({
        key: 'status',
        label: 'Status',
        options: of([
          {key: 'all', value: 'All'},
          {key: 'linked', value: 'Linked'},
          {key: 'unlinked', value: 'Unlinked'},
        ]),
        fxLayout: 'row',
        onChange: (status) =>
          this.router.navigate([], {queryParams: { status }, queryParamsHandling: 'merge', replaceUrl: true})
      })
    ]
  ];

  public formModel: RespondentsFilters =
    { status: this.route.snapshot.queryParams[RespondentsList.STATUS_PARAM] || RespondentsList.DEFAULT_STATUS };

  public data$ = combineLatest([this.respondents$, this.route.queryParams])
    .pipe(
      map(([respondents, qp]) => {
        switch (qp[RespondentsList.STATUS_PARAM]) {
          case 'linked':
            return respondents.filter((d) => !!d.employeeView);
          case 'unlinked':
            return respondents.filter((d) => !d.employeeView);
          default:
            return respondents;
        }
      })
    );

  public columns: TableColumn<RespondentFlat>[] = this.getColumns(this.route.snapshot.queryParams[RespondentsList.VIEW_MODE_PARAM] || RespondentsList.DEFAULT_VIEW);

  public rowMenuItems: RowMenuItem<RespondentFlat>[] = [
    {
      name: (row) => 'View Employee',
      callback: (row) => this.router.navigate(['/employees', row.employeeView?.id, 'view']),
      hide: (row) => !row.employeeView,
    },
    {
      name: (row) => `Link to Employee${row.proposedMatches?.length ? ` (${row.proposedMatches.length} proposed matches)` : ''}`,
      callback: (row) => this.router.navigate(['link', row.id], {relativeTo: this.route.parent}),
      hide: (row) => !!row.employeeView,
    },
    {
      name: () => 'Attach File(s)',
      callback: (data: any, index) => this.dialog.open(AttachFilesComponent, {data}).afterClosed()
        .pipe(filter((res) => !!res))
        .subscribe(() => {
          this.dataService.getOne(data.id).subscribe((r) => {
            data.attachedFiles = r.attachedFiles;
            this.table.recalculateRow(index);
          });
        }),
    },
    {
      name: (row: any) => `View ${row.attachedFiles.length} Attachment${row.attachedFiles.length === 1 ? '' : 's'}`,
      callback: (data, index) => this.dialog.open(ViewAttachedFilesComponent, {data})
        .afterClosed()
        .subscribe(noop, noop, () => this.table.recalculateRow(index)),
      hide: (row: any) => !row.attachedFiles.length,
    },
    {
      name: (row) => `${!row.notes ? 'Add' : 'Edit'} Notes`,
      callback: (data, index) => this.dialog.open(EditNotesComponent, {data})
        .afterClosed()
        .pipe(filter((res) => !!res))
        .subscribe((notes) => {
          data.notes = notes;
          this.table.recalculateRow(index);
          this.notifications.showSimpleInfoMessage(`Successfully saved notes for ${data.name}`);
        })
    },
    {
      name: () => 'Delete Notes',
      callback: (row, index) => {
        const data = {
          title: 'Confirm Delete',
          text: `Are you sure you want to delete the notes for ${row.name}?`,
          confirmText: 'Yes',
        };
        this.asyncRowAction(this.dataService.patch(row.id, {notes: ''}), row.id, data)
          .subscribe(() => {
            row.notes = '';
            this.table.recalculateRow(index);
            this.notifications.showSimpleInfoMessage(`Successfully deleted notes for ${row.name}`);
          });
      },
      hide: (row) => !row.notes,
    },
    {
      name: () => 'View PDF',
      callback: (row) => this.asyncRowAction(this.dataService.getPDF(row.pdfId as string), row.id)
        .subscribe((res) => window.open(URL.createObjectURL(res), '_blank')),
      disabled: (row) => !row.pdfId,
    },
    {
      name: () => 'Unlink from Employee',
      callback: (row, index) => {
        const data = {
          title: 'Confirm Unlink',
          text: `Are you sure you want to unlink ${row.name}?`,
          confirmText: 'Yes',
        };
        this.asyncRowAction(this.dataService.patch(row.id, {employeeId: 0}), row.id, data)
          .subscribe(() => {
            delete row.employeeView;
            delete row.employeeId;
            this.table.recalculateRow(index);
            this.notifications.showSimpleInfoMessage(`Successfully unlinked ${row.name}`);
          });
      },
      hide: (row) => !row.employeeView
    },
    {
      name: (row) => `Delete ${row.name}`,
      callback: (row) => {
        const data = {
          title: 'Confirm Delete',
          text: `Are you sure you want to delete ${row.name}?`,
          confirmText: 'Yes',
        };
        this.asyncRowAction(this.dataService.remove(row.id), row.id, data)
          .subscribe(() => {
            this.notifications.showSimpleInfoMessage(`Successfully deleted ${row.name}`);
            this.refreshRespondents$.next(void 0);
          });
      },
    },
  ];

  public exportRespondents$ = new Subject<Respondent[]>();

  public viewMode$: Observable<string> = this.route.queryParams
    .pipe(map((qp) => qp[RespondentsList.VIEW_MODE_PARAM] || this.viewModes[0].toLowerCase()));

  public viewModes: string[] = ['BUE', 'Survey', 'Contact', 'Notes'];

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected notifications: NotificationsService,
    protected dialog: MatDialog,
    protected csvService: NgxCsvService,
    protected dataService: RespondentDataService,
    protected columnConfigService: ColumnConfigService,
  ) {
    this.exportRespondents$
      .pipe(debounceTime(300))
      .subscribe((respondents) => {
        const formattedData = respondents.map((d) => {
          const formatted: any = {...d};
          forIn(formatted, (val, key) => formatted[key] = val === true ? 'YES' : val === false ? 'NO' : val);
          return formatted;
        });
        const startIndex = this.columnConfigService.sharedColumns.length;
        const columns = flatten(this.viewModes.map((viewMode, index) =>
          this.getColumns(viewMode.toLowerCase()).slice(index > 0 ? startIndex : (startIndex - 1))));
        this.csvService.download(formattedData, columns, 'Respondents');
      });
  }

  public viewModeChange(viewMode: string): void {
    this.columns = this.getColumns(viewMode);
    this.router.navigate([], {queryParams: { viewMode }, replaceUrl: true, queryParamsHandling: 'merge'});
  }

  protected sanitizeRespondent(respondent: Respondent): RespondentFlat {
    return {
      ...respondent,
      ...respondent.progress,
      ...respondent.employeeView,
      id: respondent.id,
      name: respondent.name,
      whenSubmitted: formatDateTime(respondent.whenSubmitted),
    };
  }

  protected abstract getColumns(viewMode: string): TableColumn<RespondentFlat>[];

  private asyncRowAction(request$: Observable<any>, id: string, confirmData?: ConfirmDialogData): Observable<any> {
    if (confirmData) {
      return this.dialog.open(ConfirmDialogComponent, { data: confirmData })
        .afterClosed()
        .pipe(
          filter((res) => !!res),
          switchMap(() => this.asyncRowAction(request$, id)),
        );
    }
    return request$;
  }
}

export interface RespondentFlat extends Respondent {
  [key: string]: any;
}

interface RespondentsFilters {
  status: 'linked' | 'unlinked' | 'all';
}

export function rowIcon<T>(field: Extract<keyof T, string>): (row: T) => string {
  return (row: T) => String(row[field]) === 'Uncertain' ? 'question_mark' : row[field] ? 'check' : 'close';
}

export function rowColor<T>(field: Extract<keyof T, string>): (row: T) => string {
  return (row: T) => String(row[field]) === 'Uncertain' ? 'orange' : row[field] ? 'green' : 'red';
}
