import {Injectable} from '@angular/core';
import {FieldBase} from './fields/field-base';
import {FormControl, Validators, UntypedFormGroup} from '@angular/forms';
import {flatten} from 'lodash-es';

@Injectable()
export class FieldControlService {
  public addControls(form: UntypedFormGroup, fields: FieldBase<any>[][]): void {
    flatten(fields).forEach((field) => {
      const validators = field.validators || [];
      if (field.required) {
        validators.unshift(Validators.required);
      }
      const control = new FormControl(field.value, validators);
      const onChange = field.onChange;
      if (onChange) {
        control.valueChanges.subscribe((value) => onChange(value, form));
      }
      form.setControl(field.key, control, {emitEvent: false});
    });
  }
}
