import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SettlementComponent} from '../settlement.component';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {ListItem} from '../../../shared/property-list/property-list.component';
import {Settlement} from '../../../../models/settlement.model';

@Component({
  selector: 'app-view-settlement',
  templateUrl: './view-settlement.component.html',
  styleUrls: ['./view-settlement.component.scss']
})
export class ViewSettlementComponent extends SettlementComponent {
  public isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({matches}) => matches)
  );
  public generalItems: ListItem<Settlement>[] = [
    new ListItem('ID', 'id'),
    new ListItem('Code', 'code'),
    new ListItem('Title', 'title'),
    new ListItem('Title Long', 'titleLong'),
    new ListItem('Type', 'type'),
    new ListItem('Date', 'date', 'date'),
    new ListItem('Liability Amount', 'liabilityAmount', 'currency'),
    new ListItem('Accrued Interest', 'accruedInterestAmount', 'currency'),
    new ListItem('Case Number', 'case'),
    new ListItem('Plaintiff Name', 'plaintiffName'),
    new ListItem('Plaintiff Attorney Name', 'plaintiffAttorneyName'),
    new ListItem('Defendant Name', 'defendantName'),
    new ListItem('Defendant Attorney Name', 'defendantAttorneyName'),
    new ListItem('Email', 'adminEmail'),
    new ListItem('Phone', 'adminPhone'),
    new ListItem('Fax', 'adminFax'),
  ];
  public statusItems: ListItem<Settlement>[] = [
    new ListItem('Public', 'isPublic', 'icon'),
    new ListItem('Open', 'isOpen', 'icon'),
    new ListItem('Donation', 'canDonate', 'icon'),
    new ListItem('Logo', 'logoImage', 'link'),
    new ListItem('Banner Prefix', 'bannerPrefix'),
    new ListItem('Style Prefix', 'stylePrefix'),
  ];
  public formsItems: ListItem<Settlement>[] = [
    new ListItem('Form 1187 - Agency', 'form1187Agency'),
    new ListItem('Form 1187 - Labor Organization', 'form1187LaborOrg'),
    new ListItem('Form 1187 - Labor Organization Short', 'form1187LaborOrgShort'),
    new ListItem('Form 1187 - Dues Amount', 'form1187DuesAmount'),
    new ListItem('Form 1187 - Dues Frequency', 'form1187DuesFrequency'),
  ];
  public claimsItems: ListItem<Settlement>[] = [
    new ListItem('Claims Start Year', 'claimStartYear'),
    new ListItem('Claims Start Quarter', 'claimStartQuarter'),
    new ListItem('Claims End Year', 'claimEndYear'),
    new ListItem('Claims End Quarter', 'claimEndQuarter'),
    new ListItem('Form', 'claimForm'),
    new ListItem('Ask About Support Materials', 'claimRequestSupport', 'icon'),
    new ListItem('Claims Deadline (date)', 'claimDeadlineDate'),
    new ListItem('Claims Deadline (time)', 'claimDeadlineTime'),
  ];
  public textItems: ListItem<Settlement>[] = [
    new ListItem('Email Intro', 'textEmailIntro', 'html'),
    new ListItem('Front Page Text', 'textFrontpage', 'html'),
    new ListItem('Intro', 'textIntro', 'html'),
    new ListItem('Donation Page Text', 'textDonation', 'html'),
    new ListItem('Opt-out Page Text', 'textOptout', 'html'),
    new ListItem('Agreement Intro', 'textAgrmtIntro', 'html'),
    new ListItem('Agreement Content', 'textAgrmtContent', 'html'),
    new ListItem('Payment Timeframe', 'paymentTimeframe'),
  ];
  constructor(
    protected override route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
  ) {
    super(route);
  }
}
