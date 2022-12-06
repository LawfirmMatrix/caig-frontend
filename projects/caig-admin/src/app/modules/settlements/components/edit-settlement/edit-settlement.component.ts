import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-edit-settlement',
  templateUrl: './edit-settlement.component.html',
  styleUrls: ['./edit-settlement.component.scss']
})
export class EditSettlementComponent {
  public settlement$ = this.route.data.pipe(
    map((data) => data['settlement'])
  );
  constructor(private route: ActivatedRoute) { }
}
