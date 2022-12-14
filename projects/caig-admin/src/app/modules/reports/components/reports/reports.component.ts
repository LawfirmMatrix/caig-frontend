import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {startCase} from 'lodash-es';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  private static readonly DEFAULT_HEADER = 'Reports';
  public static readonly ENCRYPTED_SSN = 'xxx-xxx-xxxx';
  public header = ReportsComponent.DEFAULT_HEADER;
  public decrypt = false;
  constructor(public route: ActivatedRoute) { }
  public onActivate(): void {
    const snapshot = this.route.firstChild?.snapshot;
    if (snapshot) {
      const segment = snapshot.url[0];
      const hasSsn = snapshot.data['hasSsn'] === true;
      this.header = segment ? startCase(segment.path) : ReportsComponent.DEFAULT_HEADER;
      this.decrypt = hasSsn;
    }
  }
}
