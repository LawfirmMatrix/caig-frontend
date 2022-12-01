import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {filter} from 'rxjs';
import {Employee} from '../../../../models/employee.model';
import {map, switchMap, withLatestFrom} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {EmailEditorContainer} from '../email-editor-container';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {MatDialog} from '@angular/material/dialog';
import {FormDialogComponent, FormDialogData} from '../../../../core/components/form-dialog/form-dialog.component';
import {InputField} from 'dynamic-form';
import {Validators} from '@angular/forms';
import {EmployeeEntityService} from '../../../employees/services/employee-entity.service';

@Component({
  selector: 'app-batch-email',
  templateUrl: './batch-email.component.html',
  styleUrls: ['./batch-email.component.scss']
})
export class BatchEmailComponent extends EmailEditorContainer implements OnInit {
  public employees: Employee[] | undefined;
  public invalidEmployees: Employee[] | undefined;
  public invalidEmployee: Employee | undefined;
  constructor(
    private employeeService: EmployeeEntityService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    protected override store: Store<AppState>,
  ) {
    super(store);
  }
  public ngOnInit() {
    this.route.data
      .pipe(map((data) => data['employees']))
      .subscribe((employees: Employee[]) => this.initializeEmployees(employees));
  }
  public scrollToNextInvalid(viewport: CdkVirtualScrollViewport): void {
    if (this.employees && this.invalidEmployees && this.invalidEmployees.length) {
      const index = this.employees.findIndex((e) => e === (this.invalidEmployees as Employee[])[0]);
      this.invalidEmployee = this.employees[index];
      viewport.scrollToIndex(index);
    }
  }
  public getEmailForEmployee(employee: Employee): void {
    const data: FormDialogData = {
      title: `Enter an email address for ${employee.name}`,
      confirmText: 'Save',
      fields: [
        [
          new InputField({
            key: 'email',
            label: 'Email',
            validators: [ Validators.email ],
            required: true,
          })
        ]
      ],
    };
    this.dialog.open(FormDialogComponent, {data})
      .afterClosed()
      .pipe(
        filter((res) => !!res),
        switchMap(({email}) => this.employeeService.update({...employee, email})),
        withLatestFrom(this.employeeService.entities$)
      )
      .subscribe(([, employees]) => {
        this.initializeEmployees(employees);
        this.invalidEmployee = undefined;
      });
  }
  private initializeEmployees(employees: Employee[]): void {
    this.employees = employees;
    this.invalidEmployees = employees.filter((e) => !e.email && !e.emailAlt);
  }
}
