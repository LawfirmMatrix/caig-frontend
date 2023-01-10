import {Component, OnInit} from '@angular/core';
import {EmployeeEntityService} from '../../../employees/services/employee-entity.service';
import {switchMap} from 'rxjs/operators';
import {of, Observable, noop} from 'rxjs';
import {Employee} from '../../../../models/employee.model';
import {TableColumn, RowMenuItem, TableMenuItem} from 'vs-table';
import {Router, ActivatedRoute} from '@angular/router';
import {ToolbarButton} from '../../../shared/employee/component/toolbar-buttons/toolbar-buttons.component';
import {KeyValue} from '@angular/common';
import {MatDialog} from '@angular/material/dialog';
import {EmployeesFilterComponent} from '../employees-filter/employees-filter.component';

@Component({
  selector: 'app-employees-list',
  templateUrl: './employees-list.component.html',
  styleUrls: ['./employees-list.component.scss']
})
export class EmployeesListComponent implements OnInit {
  private static readonly VIEW_MODE_STORAGE = 'EMP_VIEW_MODE';
  public employees$: Observable<Employee[] | null> = this.employeeService.loaded$
    .pipe(
      switchMap((loaded) => loaded ? this.employeeService.entities$ : of(null))
    );
  public tableColumns: TableColumn<Employee>[] = [];
  public rowMenuItems: RowMenuItem<Employee>[] = [];
  public tableMenuItems: TableMenuItem<Employee>[] = [];
  public settlementIdPainter: ((row: Employee) => string) | undefined;
  public rowTooltip: ((row: Employee) => string) | undefined;
  public toolbarButtons: ToolbarButton[] = [
    {
      label: 'New Registration',
      icon: 'add_circle',
      callback: noop,
      disabled: true,
    },
    {
      label: 'New Employee',
      icon: 'add_circle',
      routerLink: '/employees/new'
    },
    {
      label: 'Upload Employees',
      icon: 'cloud_upload',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Update from Experian',
      icon: 'upload',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Update from CSV',
      icon: 'upload',
      callback: noop,
      disabled: true,
    },
    {
      label: 'Update Amounts',
      icon: 'upload',
      callback: noop,
      disabled: true,
    },
  ];
  public viewModes = EmployeeViewMode;
  public viewMode: EmployeeViewMode = EmployeeViewMode.Basic;

  constructor(
    private employeeService: EmployeeEntityService,
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
  ) {
  }

  public ngOnInit() {
    try {
      const viewMode = localStorage.getItem(EmployeesListComponent.VIEW_MODE_STORAGE);
      const isViewMode = (stored: string): stored is EmployeeViewMode => Object.values<string>(EmployeeViewMode).includes(stored);
      if (viewMode && isViewMode(viewMode)) {
        this.viewMode = viewMode;
      }
    } catch { }

    console.log(this.viewModes);

  }

  public viewModeChange(viewMode: EmployeeViewMode): void {
    try {
      localStorage.setItem(EmployeesListComponent.VIEW_MODE_STORAGE, viewMode.toString());
    } catch { }
    this.setColumns(viewMode);
  }

  public viewEmployee(employee: Employee): void {
    this.router.navigate([employee.id], {relativeTo: this.route.parent});
  }

  public viewModeCompare(a: KeyValue<any, any>, b: KeyValue<any, any>): number {
    return 0;
  }

  public openFilters(): void {
    this.dialog.open(EmployeesFilterComponent, { data: { } })
      .afterClosed()
      .subscribe((result) => console.log(result));
  }

  private setColumns(viewMode: EmployeeViewMode): void {
    // @TODO
  }
}

enum EmployeeViewMode {
  Basic = 'basic',
  BUE = 'bue',
  Financial = 'financial',
}
