import {Component, OnDestroy, OnInit} from '@angular/core';
import {MsalService} from '@azure/msal-angular';
import {noop, Observable, of, ReplaySubject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, first, map, skip, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {ToolbarButton} from '../../../shared/employee/component/toolbar-buttons/toolbar-buttons.component';
import {EmployeeEntityService} from '../../services/employee-entity.service';
import {Employee} from '../../../../models/employee.model';
import {concatName, isNotUndefined} from '../../../../core/util/functions';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {settlementId} from '../../../../core/store/selectors/core.selectors';

@Component({
  selector: 'app-view-bue',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit, OnDestroy {
  private onDestroy$ = new ReplaySubject<void>();
  public gridColumns$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(({matches}) => matches ? 1 : 2));
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'Employees',
      icon: 'chevron_left',
      routerLink: '/employees',
    },
    {
      label: 'Edit',
      icon: 'edit',
      routerLink: '../edit',
    },
    {
      label: 'Manual Paycheck',
      icon: 'payments',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Pay',
      callback: noop,
      disabled: true,
    },
    {
      label: 'D/L Dues Forms',
      callback: noop,
      disabled: true,
    },
    {
      label: 'D/L Tax Form',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Delete',
      icon: 'delete',
      callback: () => this.deleteEmployee(),
      color: 'warn',
    },
  ];

  public employee: Employee | undefined;
  public employeeIndex: number | undefined;
  public allEmployees$ = this.employeeService.entities$;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private msalService: MsalService,
    private employeeService: EmployeeEntityService,
    private notifications: NotificationsService,
    private dialog: MatDialog,
    private store: Store<AppState>
  ) {
  }
  public ngOnInit() {
    this.route.params
      .pipe(
        tap((params) => {
          this.employee = undefined;
          this.employeeService.getByKey(params['id']);
        }),
        switchMap((params) =>
          this.employeeService.entityMap$.pipe(
            map((entityMap) => entityMap[Number(params['id'])])
          )
        ),
        filter(isNotUndefined),
        tap((employee) => this.employee = employee),
        withLatestFrom(this.store.select(settlementId)),
        map(([employee, settlementId]) => employee.settlementId === settlementId),
        tap((inSettlement) => {
          if (!inSettlement) {
            this.employeeService.cancel();
          }
        }),
        switchMap((inSettlement) => inSettlement ? this.findEmployeeIndex() : of(null)),
        takeUntil(this.onDestroy$),
      )
      .subscribe();

    this.store.select(settlementId)
      .pipe(
        skip(1),
        takeUntil(this.onDestroy$)
      )
      .subscribe(() => {
        this.employeeService.clearCache();
        if (this.employeeService.activeCorrelationId) {
          this.employeeService.cancel();
          this.employeeService.getAll().subscribe();
        }
      });
  }

  public ngOnDestroy() {
    this.onDestroy$.next(void 0);
  }

  private findEmployeeIndex(): Observable<any> {
    return this.employeeService.loaded$
      .pipe(
        filter((loaded) => loaded),
        switchMap(() => this.employeeService.keys$),
        tap((employeeIds) => this.employeeIndex = employeeIds.findIndex((id) => id == this.route.snapshot.params['id']) + 1),
        first(),
      );
  }

  private deleteEmployee(): void {
    if (this.employee) {
      const name = concatName(this.employee);
      const data: ConfirmDialogData = {
        title: 'Confirm Delete',
        text: `Are you sure you want to delete ${name}?`,
        confirmText: 'Yes',
      };
      this.dialog.open(ConfirmDialogComponent, {data})
        .afterClosed()
        .pipe(
          map((ok) => ok ? this.employee : undefined),
          filter(isNotUndefined),
          switchMap((employee) => this.employeeService.delete(employee.id).pipe(map(() => employee))),
        )
        .subscribe((emp) => {
          this.notifications.showSimpleInfoMessage(`Successfully deleted ${concatName(emp)}`);
          this.router.navigate(['/employees'], {replaceUrl: true, queryParamsHandling: 'preserve'});
        });
    }
  }
  public cycleTo(employees: Employee[], index: number): void {
    const bue = employees[index];
    this.router.navigate([bue.id, 'view'], {relativeTo: this.route.parent, queryParamsHandling: 'preserve'});
  }
}
