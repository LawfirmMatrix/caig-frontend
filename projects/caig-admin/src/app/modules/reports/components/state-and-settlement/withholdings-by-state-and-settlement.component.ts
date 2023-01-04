import {Component} from '@angular/core';
import {StateAndSettlement} from './state-and-settlement';
import {ReportDataService} from '../../services/report-data.service';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-withholdings-by-state-and-settlement',
  templateUrl: './state-and-settlement.html',
  styleUrls: ['./state-and-settlement.scss']
})
export class WithholdingsByStateAndSettlementComponent extends StateAndSettlement {
  protected valueField = 'stateTaxes' as 'stateTaxes';
  constructor(
    protected override dataService: ReportDataService,
    protected override router: Router,
    protected override route: ActivatedRoute,
  ) {
    super(dataService, router, route);
  }
}
