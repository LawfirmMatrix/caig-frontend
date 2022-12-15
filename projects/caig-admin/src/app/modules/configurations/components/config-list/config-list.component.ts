import {Component} from '@angular/core';
import {configsList} from '../../configurations-routing.module';
import {Routes} from '@angular/router';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent {
  public list: Routes = configsList;
}
