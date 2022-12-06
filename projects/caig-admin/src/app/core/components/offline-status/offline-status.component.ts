import {Component} from '@angular/core';
import {OfflineStatusService} from '../../services/offline-status.service';

@Component({
  selector: 'app-offline-status',
  templateUrl: './offline-status.component.html',
  styleUrls: ['./offline-status.component.scss']
})
export class OfflineStatusComponent {
  constructor(public offlineService: OfflineStatusService) { }
}
