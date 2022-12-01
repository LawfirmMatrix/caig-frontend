import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-email-menu',
  templateUrl: './email-menu.component.html',
  styleUrls: ['./email-menu.component.scss']
})
export class EmailMenuComponent {
  @Input() public email: string | undefined;
}
