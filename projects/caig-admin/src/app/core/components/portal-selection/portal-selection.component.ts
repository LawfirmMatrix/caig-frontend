import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../store/reducers';
import {isSuperAdmin, selectCoreState} from '../../store/selectors/core.selectors';
import {SelectField} from 'dynamic-form';
import {of} from 'rxjs';
import {Portal} from '../../../models/session.model';
import {CoreActions} from '../../store/actions/action-types';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-portal-selection',
  template: `
    <div *ngIf="isSuperAdmin$ | async" fxLayoutAlign="start center">
      <dynamic-form [fields]="[[portalSelection]]" [model]="coreState$ | async"></dynamic-form>
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
  private static readonly PORTAL_KEY = 'PORTAL';
  public isSuperAdmin$ = this.store.select(isSuperAdmin);
  public portalSelection = new SelectField({
    key: 'portal',
    label: 'Portal',
    options: of([{name: Portal.CAIG}, {name: Portal.CallCenter}, {name: Portal.Survey}]),
    itemKey: 'name',
    displayField: 'name',
    onChange: (portal) => {
      this.store.dispatch(CoreActions.portalChange({portal}));
      this.router.navigateByUrl('/');
      localStorage.setItem(PortalSelectionComponent.PORTAL_KEY, portal);
    }
  });
  public coreState$ = this.store.select(selectCoreState).pipe(
    map((state) => localStorage.getItem(PortalSelectionComponent.PORTAL_KEY) || state.portal)
  );
  constructor(private store: Store<AppState>, private router: Router) { }
}
