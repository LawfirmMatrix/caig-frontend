import {Component, Input, ViewChild, OnChanges, SimpleChanges} from '@angular/core';
import {Employee} from '../../../../../../models/employee.model';
import {MatInput} from '@angular/material/input';
import {EmployeeEntityService} from '../../../../services/employee-entity.service';
import {NotificationsService} from 'notifications';

@Component({
  selector: 'app-decrypt-button',
  templateUrl: './decrypt-button.component.html',
  styleUrls: ['./decrypt-button.component.scss']
})
export class DecryptButtonComponent implements OnChanges {
  @Input() public employee!: Employee;
  @Input() public prop!: keyof Employee;
  @ViewChild(MatInput) public input!: MatInput;
  public isProcessing = false;
  public editMode = false;
  public employeeValue = '';
  public decryptedValue = '';
  constructor(
    private dataService: EmployeeEntityService,
    private notifications: NotificationsService,
  ) { }
  public ngOnChanges(changes: SimpleChanges) {
    if (this.employee && this.prop) {
      this.employeeValue = this.employee[this.prop] as string;
    }
  }
  public decrypt(): void {
    this.isProcessing = true;
    this.dataService.decrypt(this.employee.id, this.prop)
      .subscribe((res) => {
        this.decryptedValue = res[this.prop];
        this.isProcessing = false;
      }, () => this.isProcessing = false);
  }
  public saveChanges(input: MatInput): void {
    this.isProcessing = true;
    this.dataService.patch({ id: this.employee.id, [this.prop]: input.value })
      .subscribe(() => {
        this.employeeValue = '[Encrypted]';
        this.editMode = false;
        this.isProcessing = false;
        this.notifications.showSimpleInfoMessage(`Successfully updated employee's ${this.prop}`);
      }, () => this.isProcessing = false);
  }
  public toggleEditMode(): void {
    this.editMode = !this.editMode;
    setTimeout(() => this.input?.focus());
  }
}
