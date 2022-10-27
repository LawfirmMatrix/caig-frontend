import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FieldBase, SelectField} from 'dynamic-form';
import {Employee} from '../../../models/employee.model';
import {usersForSettlement} from '../../../modules/users/store/selectors/user.selectors';
import {isNotUndefined} from '../../util/functions';
import {filter, map, tap} from 'rxjs/operators';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {EmployeeEntityService} from '../../../modules/employees/services/employee-entity.service';
import {User} from '../../../models/session.model';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html'
})
export class AssignUserComponent {
  public userId: number | undefined;
  public changed = false;
  public fields: FieldBase<any>[][] = [
    [
      new SelectField({
        key: 'userId',
        label: 'User',
        options: this.store.select(usersForSettlement)
          .pipe(
            filter(isNotUndefined),
            tap((users) => this._users = users),
            map((users) => [{id: 0, name: '< None >'}, ...users])
          ),
        itemKey: 'id',
        displayField: 'name',
        onChange: (value) => {
          this.userId = value;
          this.changed = true;
        },
      })
    ]
  ];
  public isProcessing = false;
  private _users: User[] | undefined;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Employee[],
    private dialogRef: MatDialogRef<AssignUserComponent>,
    private store: Store<AppState>,
    private dataService: EmployeeEntityService,
  ) { }
  public save(): void {
    this.isProcessing = true;
    const userId = this.userId || 0;
    const username = this._users?.find((u) => u.id === userId)?.username;
    const onError = () => this.isProcessing = false;
    if (this.data.length === 1) {
      this.dataService.update({ ...this.data[0], userId, username })
        .subscribe(() => this.dialogRef.close(true), onError);
    } else {
      const ids = this.data.map((e) => e.id);
      const value = { userId, username };
      this.dataService.bulkPatch({ids, value}).subscribe(() => {
        this.dataService.updateManyInCache(this.data.map((e) => ({...e, ...value})));
        this.dialogRef.close(true);
      }, onError);
    }
  }
}
