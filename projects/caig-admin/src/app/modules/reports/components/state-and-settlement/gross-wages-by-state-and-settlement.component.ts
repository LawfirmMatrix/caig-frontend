import {Component} from '@angular/core';
import {StateAndSettlement} from './state-and-settlement';
import {ReportDataService} from '../../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-gross-wages-by-state-and-settlement',
  templateUrl: './state-and-settlement.html',
  styleUrls: ['./state-and-settlement.scss']
})
export class GrossWagesByStateAndSettlementComponent extends StateAndSettlement {
  protected valueField = 'totalBp' as 'totalBp';
  constructor(
    protected override dataService: ReportDataService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(dataService, router, route);
  }
}
