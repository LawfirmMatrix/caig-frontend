import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Router, ActivatedRoute} from '@angular/router';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {NgxCsvService} from 'export-csv';
import {SurveySchema} from '../../../../../../../../survey/src/app/survey/survey.service';

export abstract class RespondentsList {
  private static readonly DEFAULT_STATUS = 'all';

  protected refreshRespondents$ = new BehaviorSubject<void>(void 0);
  // protected surveyId$: Observable<string> = this.route.params
  //   .pipe(map((params) => params['surveyId']));

  // public survey$: Observable<SurveySchema> = this.surveyId$
  //   .pipe(switchMap((surveyId) => this.questionnaireService.getOne(surveyId)));
  // public respondents$: Observable<RespondentFlat[]> = combineLatest([this.refreshRespondents$, this.surveyId$])
  //   .pipe(
  //     switchMap(([, surveyId]) => this.surveyService.respondents(surveyId)),
  //     map((data) => data.map(this.sanitizeRespondent)),
  //     shareReplay(),
  //   );

  // public formFields: BaseField<any>[][] = [
  //   [
  //     new RadioField({
  //       key: 'status',
  //       label: 'Status',
  //       options: of([
  //         {key: 'all', value: 'All'},
  //         {key: 'linked', value: 'Linked'},
  //         {key: 'unlinked', value: 'Unlinked'},
  //       ]),
  //       fxLayout: 'row',
  //       onChange: (status) =>
  //         this.router.navigate([], {queryParams: { status }, queryParamsHandling: 'merge'})
  //     })
  //   ]
  // ];
  // public formModel: RespondentsFilters =
  //   { status: this.route.snapshot.queryParams.status || RespondentsList.DEFAULT_STATUS };
  //
  // public data$ = combineLatest([this.respondents$, this.route.queryParams])
  //   .pipe(
  //     map(([respondents, qp]) => {
  //       switch (qp.status) {
  //         case 'linked':
  //           return respondents.filter((d) => !!d.employeeView);
  //         case 'unlinked':
  //           return respondents.filter((d) => !d.employeeView);
  //         default:
  //           return respondents;
  //       }
  //     })
  //   );
  // public columns!: TableColumn<RespondentFlat>[];
  // public rowMenuItems: RowMenuItem<RespondentFlat>[] = [
  //   {
  //     name: (row) => `Link to Employee${row.proposedMatches?.length ? ` (${row.proposedMatches.length} proposed matches)` : ''}`,
  //     callback: (row) => {
  //       const url = row.employeeView ? ['/employees', row.employeeId] :
  //         ['/surveys', this.route.snapshot.params.surveyId, 'respondents', 'link', row.id];
  //       this.router.navigate(url);
  //     },
  //     hide: (row) => !!row.employeeView,
  //   },
  //   {
  //     name: () => 'Attach File(s)',
  //     callback: (data) => this.dialog.open(AttachFilesComponent, {data}).afterClosed()
  //       .pipe(filter((res) => !!res))
  //       .subscribe((res) => {
  //         data.fileCount = (data.fileCount || 0) + res.length;
  //         this.columns = this.columns.slice();
  //       }),
  //   },
  //   {
  //     name: (row) => `View ${row.fileCount} Attachment${row.fileCount === 1 ? '' : 's'}`,
  //     callback: (data) => this.dialog.open(ViewAttachedFilesComponent, {data})
  //       .afterClosed()
  //       .subscribe(() => this.columns = this.columns.slice()),
  //     hide: (row) => !row.fileCount,
  //   },
  //   {
  //     name: (row) => `${!row.notes ? 'Add' : 'Edit'} Notes`,
  //     callback: (data) => this.dialog.open(EditNotesComponent, {data})
  //       .afterClosed()
  //       .pipe(filter((res) => !!res))
  //       .subscribe(() => {
  //         this.columns = this.columns.slice();
  //         this.notifications.showSimpleInfoMessage(`Successfully saved notes for ${concatName(data)}`);
  //       })
  //   },
  //   {
  //     name: () => 'Delete Notes',
  //     callback: (row) => {
  //       const name = concatName(row);
  //       const data = {
  //         title: 'Confirm Delete',
  //         text: `Are you sure you want to delete the notes for ${name}?`,
  //         confirmText: 'Yes',
  //       };
  //       this.asyncRowAction(this.surveyService.patchRespondent(row.id, {notes: ''}), row.id, data)
  //         .subscribe(() => {
  //           row.notes = '';
  //           this.columns = this.columns.slice();
  //           this.notifications.showSimpleInfoMessage(`Successfully deleted notes for ${name}`);
  //         });
  //     },
  //     hide: (row) => !row.notes,
  //   },
  //   {
  //     name: () => 'View PDF',
  //     callback: (row) => this.asyncRowAction(this.surveyService.getResponse(row.pdfId as string), row.id)
  //       .subscribe((res) => window.open(URL.createObjectURL(res), '_blank')),
  //     disabled: (row) => !row.pdfId,
  //   },
  //   {
  //     name: () => 'Unlink from Employee',
  //     callback: (row) => {
  //       const name = concatName(row);
  //       const data = {
  //         title: 'Confirm Unlink',
  //         text: `Are you sure you want to unlink ${name}?`,
  //         confirmText: 'Yes',
  //       };
  //       this.asyncRowAction(this.surveyService.patchRespondent(row.id, {employeeId: 0}), row.id, data)
  //         .subscribe(() => {
  //           this.notifications.showSimpleInfoMessage(`Successfully unlinked ${name}`);
  //           this.refreshRespondents$.next(void 0);
  //         });
  //     },
  //     hide: (row) => !row.employeeView
  //   },
  //   {
  //     name: (row) => `Delete ${concatName(row)}`,
  //     callback: (row) => {
  //       const name = concatName(row);
  //       const data = {
  //         title: 'Confirm Delete',
  //         text: `Are you sure you want to delete ${name}?`,
  //         confirmText: 'Yes',
  //       };
  //       this.asyncRowAction(this.surveyService.removeRespondent(row.id), row.id, data)
  //         .subscribe(() => {
  //           this.notifications.showSimpleInfoMessage(`Successfully deleted ${name}`);
  //           this.refreshRespondents$.next(void 0);
  //         });
  //     },
  //   },
  // ];
  //
  // public exportRespondents$ = new Subject<Respondent<any>[]>();
  //
  // public viewMode$: Observable<string> = this.route.queryParams
  //   .pipe(map((qp) => qp.viewMode || this.viewModes[0].toLowerCase()));
  // public viewModes: string[] = ['BUE', 'Survey', 'Contact', 'Notes'];
  //
  // constructor(
  //   protected router: Router,
  //   protected route: ActivatedRoute,
  //   protected notifications: NotificationsService,
  //   protected dialog: MatDialog,
  //   protected csvService: NgxCsvService,
  // ) {
  //   this.viewMode$.pipe(first())
  //     .subscribe((viewMode) => this.columns = this.getColumns(viewMode));
  //   this.exportRespondents$
  //     .pipe(debounceTime(300))
  //     .subscribe((respondents) => {
  //       const formattedData = respondents.map((d) => {
  //         const formatted: any = {...d};
  //         forIn(formatted, (val, key) => formatted[key] = val === true ? 'YES' : val === false ? 'NO' : val);
  //         return formatted;
  //       });
  //       const columns = flatten(this.viewModes.map((viewMode, index) =>
  //         this.getColumns(viewMode.toLowerCase()).slice(index > 0 ? 3 : 2)));
  //       this.csvService.download(formattedData, columns, 'Respondents');
  //     });
  // }
  //
  // public viewModeChange(viewMode: string): void {
  //   this.columns = this.getColumns(viewMode);
  //   this.router.navigate([], {queryParams: { viewMode }, queryParamsHandling: 'merge'});
  // }
  //
  // protected sanitizeRespondent(respondent: Respondent<any>): RespondentFlat {
  //   return {
  //     ...respondent,
  //     ...respondent.progress,
  //     ...respondent.employeeView,
  //     id: respondent.id,
  //     name: concatName(respondent),
  //     whenSubmitted: formatDateTime(respondent.whenSubmitted),
  //   };
  // }
  //
  // protected abstract getColumns(viewMode: string): TableColumn<RespondentFlat>[];
  //
  // private asyncRowAction(request$: Observable<any>, id: string, confirmData?: ConfirmDialogData): Observable<any> {
  //   if (confirmData) {
  //     return this.dialog.open(ConfirmDialogComponent, { data: confirmData })
  //       .afterClosed()
  //       .pipe(
  //         filter((res) => !!res),
  //         switchMap(() => this.asyncRowAction(request$, id)),
  //       );
  //   }
  //   return request$;
  // }
}
