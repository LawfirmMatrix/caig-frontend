import {Component, Input} from '@angular/core';
import {FieldBase} from '../fields/field-base';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: ['./dynamic-form-field.component.css']
})
export class DynamicFormFieldComponent {
  @Input() public field!: FieldBase<any>;
  @Input() public form!: FormGroup;
  public get isValid() { return this.form.controls[this.field.key].valid; }
}
