import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {startCase} from 'lodash-es';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent {
  public static readonly ENCRYPTED_SSN = 'xxx-xxx-xxxx';
  public componentHeader: string | undefined;
  public decrypt = false;
  constructor(public route: ActivatedRoute) { }
  public onActivate(): void {
    const snapshot = this.route.firstChild?.snapshot;
    if (snapshot) {
      const segment = snapshot.url[0];
      const hasSsn = snapshot.data['hasSsn'] === true;
      this.componentHeader = segment ? startCase(segment.path) : undefined;
      this.decrypt = hasSsn;
    }
  }
}
