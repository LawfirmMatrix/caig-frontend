import {Component} from '@angular/core';
import {configsList} from '../../configurations-routing.module';

@Component({
  selector: 'app-config-list',
  templateUrl: './config-list.component.html',
  styleUrls: ['./config-list.component.scss']
})
export class ConfigListComponent {
  public list: string[] = configsList
    .map((route) => route.path)
    .filter((path): path is string => !!path);
}
