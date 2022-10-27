import {Component, Input} from '@angular/core';
import {Employee} from '../../../../../../models/employee.model';
import {DecryptService} from '../../../../services/decrypt.service';

@Component({
  selector: 'app-decrypt-button',
  templateUrl: './decrypt-button.component.html',
  styleUrls: ['./decrypt-button.component.scss']
})
export class DecryptButtonComponent {
  @Input() public employee!: Employee;
  @Input() public prop!: keyof Employee;
  public isDecrypting = false;
  public editMode = false;
  public decryptedValue: any;
  constructor(private dataService: DecryptService) { }
  public decrypt(): void {
    this.isDecrypting = true;
    this.dataService.decrypt(this.employee.id, this.prop)
      .subscribe((res) => {
        this.decryptedValue = res[this.prop];
        this.isDecrypting = false;
      }, () => this.isDecrypting = false);
  }
  public saveChanges(value: string): void {
    // @TODO - use api
    this.decryptedValue = value;
    this.editMode = false;
  }
}
