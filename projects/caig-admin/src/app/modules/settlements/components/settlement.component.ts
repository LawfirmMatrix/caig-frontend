import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Settlement} from '../../../models/settlement.model';

export abstract class SettlementComponent {
  public settlement$: Observable<Settlement | undefined> = this.route.data.pipe(map((data) => data['settlement']));
  constructor(protected route: ActivatedRoute) { }
}
