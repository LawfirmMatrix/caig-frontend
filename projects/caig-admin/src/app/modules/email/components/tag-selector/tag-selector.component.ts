import {Component} from '@angular/core';
import {Store} from '@ngrx/store';
import {AppState} from '../../../../store/reducers';
import {fields} from '../../store/selectors/email.selectors';
import {tap} from 'rxjs';
import {EmailActions} from '../../store/actions/action-types';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss']
})
export class TagSelectorComponent {
  public tags$ = this.store.select(fields).pipe(
    tap((fields) => {
      if (!fields) {
        this.store.dispatch(EmailActions.loadFields());
      }
    }),
  );
  constructor(private store: Store<AppState>) {
  }
}
