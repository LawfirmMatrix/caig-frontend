import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SettlementComponent} from '../settlement.component';

@Component({
  selector: 'app-edit-settlement',
  templateUrl: './edit-settlement.component.html',
  styleUrls: ['./edit-settlement.component.scss']
})
export class EditSettlementComponent extends SettlementComponent {
  constructor(protected override route: ActivatedRoute) {
    super(route);
  }
}
