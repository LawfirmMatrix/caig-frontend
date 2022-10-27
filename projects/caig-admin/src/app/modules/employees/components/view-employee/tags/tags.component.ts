import {Component, Input} from '@angular/core';
import {Employee} from '../../../../../models/employee.model';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  @Input() public employee!: Employee;
}
