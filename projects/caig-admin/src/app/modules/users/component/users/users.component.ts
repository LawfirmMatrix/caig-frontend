import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {NotificationsService} from 'notifications';
import {filter, switchMap} from 'rxjs/operators';
import {TableColumn, RowMenuItem, TextColumn} from 'vs-table';
import {ActivatedRoute, Router} from '@angular/router';
import {ConfirmDialogComponent} from 'shared-components';
import {User} from '../../../../models/session.model';
import {UserEntityService} from '../../services/user-entity.service';
import {UserActions} from '../../store/actions/action-types';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  public users$ = this.dataService.entities$;
  public columns: TableColumn<User>[] = [
    new TextColumn({
      title: 'Name',
      field: 'name',
    }),
    new TextColumn({
      title: 'Username',
      field: 'username',
    }),
    new TextColumn({
      title: 'Email',
      field: 'email',
    }),
    new TextColumn({
      title: 'Role',
      field: 'roleName',
    }),
  ];
  public rowMenu: RowMenuItem<User>[] = [
    {
      name: () => 'Delete',
      callback: (user) => this.deleteUser(user)
    }
  ];
  constructor(
    private dialog: MatDialog,
    private notifications: NotificationsService,
    private router: Router,
    private route: ActivatedRoute,
    private dataService: UserEntityService,
    private store: Store<AppState>,
  ) { }
  public deleteUser(user: User): void {
    const title = 'Confirm Delete';
    const text = `Are you sure want to delete ${user.name} (${user.username})?`;
    this.dialog.open(ConfirmDialogComponent, { data: { title, text }})
      .afterClosed()
      .pipe(
        filter((ok) => !!ok),
        switchMap(() => this.dataService.delete(user))
      )
      .subscribe(() => {
        this.store.dispatch(UserActions.invalidateUsers());
        this.notifications.showSimpleInfoMessage('Successfully deleted user');
      });
  }
  public editUser(user: User): void {
    this.router.navigate([user.id], {relativeTo: this.route});
  }
}
