import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {isSuperAdmin, portal} from '../../store/selectors/core.selectors';
import {SelectField} from 'dynamic-form';
import {of} from 'rxjs';
import {Portal} from '../../../models/session.model';
import {CoreActions} from '../../store/actions/action-types';
import {Router} from '@angular/router';

@Component({
  selector: 'app-portal-selection',
  template: `
    <div *ngIf="isSuperAdmin$ | async" fxLayoutAlign="start center">
      <dynamic-form *ngIf="portal$ | async as portal" [fields]="[[portalSelection]]" [model]="{portal: portal}"></dynamic-form>
    </div>
  `,
  styles: [`
    dynamic-form {
      max-height: 60px;
      font-size: 14px;
    }
  `]
})
export class PortalSelectionComponent {
  public isSuperAdmin$ = this.store.select(isSuperAdmin);
  public portal$ = this.store.select(portal);
  public portalSelection = new SelectField({
    key: 'portal',
    label: 'Portal',
    options: of(Object.values(Portal).map((name) => ({name}))),
    itemKey: 'name',
    displayField: 'name',
    onChange: (portal) => {
      this.store.dispatch(CoreActions.portalChange({portal}));
      this.router.navigateByUrl('/');
    }
  });
  constructor(private store: Store<AppState>, private router: Router) { }
}
