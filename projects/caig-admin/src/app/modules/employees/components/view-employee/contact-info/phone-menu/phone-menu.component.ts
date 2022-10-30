import {Component, Input} from '@angular/core';
import {NotificationsService} from 'notifications';
import {MatDialog} from '@angular/material/dialog';
import {Employee} from '../../../../../../models/employee.model';
import {PhoneTextComponent, PhoneTextConfig} from '../../../../../shared/employee/component/phone-text/phone-text.component';

@Component({
  selector: 'app-phone-menu',
  templateUrl: './phone-menu.component.html',
  styleUrls: ['./phone-menu.component.scss']
})
export class PhoneMenuComponent {
  @Input() public employee!: Employee;
  constructor(
    private notifications: NotificationsService,
    private dialog: MatDialog,
  ) {
  }
  public sms(tts: boolean): void {
    const config: PhoneTextConfig = { ...this.employee, tts };
    this.dialog.open(PhoneTextComponent, {data: config, width: '400px'});
  }
  public call(): void {
    this.notifications.showSimpleErrorMessage('Phone calling is currently disabled');
  }
}
