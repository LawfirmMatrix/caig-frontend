import {Component} from '@angular/core';
import {map} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-view-settlement',
  templateUrl: './view-settlement.component.html',
  styleUrls: ['./view-settlement.component.scss']
})
export class ViewSettlementComponent {
  public settlement$ = this.route.parent?.data.pipe(
    map((data) => data['settlement'])
  );
  constructor(private route: ActivatedRoute) { }
}
