import {Component, Input} from '@angular/core';
import {Employee} from '../../../../../models/employee.model';

@Component({
  selector: 'app-contact-info',
  templateUrl: './contact-info.component.html',
  styleUrls: ['./contact-info.component.scss']
})
export class ContactInfoComponent {
  @Input() public employee!: Employee;
}
