import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

export abstract class SettlementComponent {
  public settlement$ = this.route.data.pipe(map((data) => data['settlement']));
  constructor(protected route: ActivatedRoute) { }
}
