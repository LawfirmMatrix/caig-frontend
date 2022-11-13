import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {startCase, forIn, isObject, isArray} from 'lodash-es';
import {Employee} from '../../../../models/employee.model';

@Component({
  selector: 'app-employee-info',
  template: `
    <mat-toolbar>{{data.name}}</mat-toolbar>
    <mat-list role="list">
      <mat-list-item role="listitem" *ngFor="let d of employeeData | keyvalue; last as last;">
        <div style="width: 100%" fxLayout="row" fxLayoutAlign="space-between center" fxLayoutGap="150px">
          <div>{{d.key}}</div>
          <div>{{d.value === true ? 'Yes' : d.value === false ? 'No' : d.value}}</div>
        </div>
        <mat-divider *ngIf="!last"></mat-divider>
      </mat-list-item>
    </mat-list>
  `,
  styles: [`
    mat-toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
    }

    ::ng-deep .mat-dialog-container {
      padding: 0;
    }
  `],
})
export class EmployeeInfoComponent implements OnInit {
  public employeeData: any = {};
  constructor(@Inject(MAT_DIALOG_DATA) public data: Employee) { }
  public ngOnInit() {
    forIn(this.data, (value, key) => {
      if (!isObject(value) && !isArray(value) && !key.toLowerCase().includes('id')) {
        this.employeeData[startCase(key)] = value;
      }
    });
  }
}
