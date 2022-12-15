import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {startCase} from 'lodash-es';

@Component({
  selector: 'app-configurations',
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent {
  public componentHeader: string | undefined;
  constructor(public route: ActivatedRoute) { }
  public onActivate(): void {
    const snapshot = this.route.firstChild?.snapshot;
    if (snapshot) {
      const segment = snapshot.url[0];
      this.componentHeader = segment ? startCase(segment.path) : undefined;
    }
  }
}
