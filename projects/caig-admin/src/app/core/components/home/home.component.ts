import {Component} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ChangePasswordComponent, ChangePasswordData} from '../change-password/change-password.component';
import {User} from '../../../models/session.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {user} from '../../store/selectors/core.selectors';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public user$: Observable<any> = this.store.select(user);
  constructor(private store: Store<AppState>, private dialog: MatDialog) { }
  public compare(a: any, b: any): number {
    return 0;
  }
  public changePassword(user: User): void {
    const data: ChangePasswordData = { userId: user.id, self: true };
    this.dialog.open(ChangePasswordComponent, { data });
  }
}
