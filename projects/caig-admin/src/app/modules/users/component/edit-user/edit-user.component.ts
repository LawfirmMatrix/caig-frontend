import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {Validators, UntypedFormGroup} from '@angular/forms';
import {FieldBase, InputField, SelectField} from 'dynamic-form';
import {Clipboard} from '@angular/cdk/clipboard';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {TableColumn, TextColumn} from 'vs-table';
import {BehaviorSubject, combineLatest, Observable} from 'rxjs';
import {Role, User, UserSettlement} from '../../../../models/session.model';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {settlements} from '../../../../core/store/selectors/core.selectors';
import {isNotUndefined} from '../../../../core/util/functions';
import {
  ChangePasswordComponent,
  ChangePasswordData,
  changePasswordOnNextLogin,
  copyContentButton,
  generatePasswordButton,
  visibilityButton
} from '../../../../core/components/change-password/change-password.component';
import {roles} from '../../store/selectors/user.selectors';
import {UserEntityService} from '../../services/user-entity.service';
import {UserActions} from '../../store/actions/action-types';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'firstName',
        label: 'First Name',
        required: true,
      }),
      new InputField({
        key: 'lastName',
        label: 'Last Name',
        required: true,
      }),
    ],
    [
      new InputField({
        key: 'email',
        label: 'Email',
        validators: [Validators.email],
        required: true,
      }),
    ],
    [
      new SelectField({
        key: 'roleId',
        label: 'Role',
        options: this.store.select(roles).pipe(filter(isNotUndefined)),
        itemKey: 'id',
        displayField: 'name',
        required: true,
        onChange: (value) => this.showSettlements = value !== Role.Superadmin,
      })
    ],
    [
      new InputField({
        key: 'username',
        label: 'Username',
        required: true,
      }),
    ],
  ];
  public settlementSelection$ = new BehaviorSubject<UserSettlement[]>([]);
  public user: User | null = null;
  public disableSave$!: Observable<boolean>;
  public settlements$: Observable<any[]> = this.store.select(settlements).pipe(filter(isNotUndefined));
  public settlementColumns: TableColumn<UserSettlement>[] = [
    new TextColumn({
      title: 'Code',
      field: 'code',
    })
  ];
  public showSettlements = false;
  public selectUserSettlements: ((s: UserSettlement) => boolean) | undefined;
  constructor(
    public route: ActivatedRoute,
    private clipboard: Clipboard,
    private notifications: NotificationsService,
    private router: Router,
    private dialog: MatDialog,
    private store: Store<AppState>,
    private dataService: UserEntityService,
  ) {
  }
  public ngOnInit() {
    this.disableSave$ = combineLatest([this.form.valueChanges.pipe(startWith(this.form.value)), this.settlementSelection$])
      .pipe(
        map(([value, settlements]: [any, any[]]) => this.form.status !== 'VALID' || (value.roleId !== Role.Superadmin && !settlements.length)),
        startWith(true)
      );
    this.route.params
      .pipe(
        filter((params) => !!params['id']),
        tap(() => this.user = null),
        switchMap((params) => this.dataService.getByKey(params['id']))
      )
      .subscribe((user) => {
        this.user = user;
        this.showSettlements = user.roleId !== Role.Superadmin;
        this.selectUserSettlements = (s) => !!user.settlements?.find((us) => us.id === s.id);
      });
    if (!this.route.snapshot.params['id']) {
      const passwordField = new InputField({
        key: 'password',
        label: 'Password',
        required: true,
        type: 'password',
      });
      passwordField.buttons = [
        visibilityButton(passwordField),
        generatePasswordButton(this.form),
        copyContentButton(this.clipboard, this.notifications),
      ];
      this.fields.push([ passwordField ], [ changePasswordOnNextLogin ]);
    }
  }
  public save(): void {
    const changes = {...this.user, ...this.form.value, settlements: this.settlementSelection$.value};
    this.form.disable();
    const request$ = changes.id ? this.dataService.update(changes) : this.dataService.add(changes, {isOptimistic: false});
    request$.subscribe(() => {
      if (!changes.id) {
        this.store.dispatch(UserActions.invalidateUsers());
      }
      this.notifications.showSimpleInfoMessage(`Successfully ${changes.id ? 'updated' : 'created'} user`);
      this.router.navigate(['../'], {relativeTo: this.route});
    }, () => this.form.enable());
  }
  public changePassword(): void {
    if (this.user) {
      const data: ChangePasswordData = { userId: this.user.id, self: false };
      this.dialog.open(ChangePasswordComponent, { data });
    }
  }
}
