import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {map, tap} from 'rxjs/operators';
import {ConfirmDialogComponent, ConfirmDialogData} from 'shared-components';

@Injectable()
export class UnsavedChangesGuard<T extends {disableSave: boolean}> implements CanDeactivate<T> {
  constructor(private dialog: MatDialog) { }

  canDeactivate(component: T, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!component.disableSave) {
      const data: ConfirmDialogData = {
        title: 'Warning!',
        text: 'You have unsaved changes. Discard changes?',
      };
      return this.dialog.open(ConfirmDialogComponent, {data})
        .afterClosed()
        .pipe(
          tap((res) => component.disableSave = !!res),
          map((res) => !!res),
        );
    }
    return true;
  }

}
