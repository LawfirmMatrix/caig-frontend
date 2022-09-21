import {Injectable} from '@angular/core';
import {FieldBase} from './fields/field-base';
import {FormControl, Validators, FormGroup} from '@angular/forms';
import {flatten} from 'lodash-es';

@Injectable()
export class FieldControlService {
  public mergeControls(form: FormGroup, fields: FieldBase<any>[][]): void {
    const existingControls = Object.keys(form.controls);
    const flattenedFields = flatten(fields);
    const flattenedFieldKeys = flattenedFields.map((field) => field.key).filter((key) => !!key);
    const fieldsToAdd = flattenedFieldKeys.filter((field) => existingControls.indexOf(field) === -1);
    const fieldsToRemove = existingControls.filter((field) => flattenedFieldKeys.indexOf(field) === -1);

    fieldsToAdd.forEach((key) => {
      const field = flattenedFields.find((f) => f.key === key) as FieldBase<any>;
      const value = field.value || '';
      form.addControl(key, field.required ? new FormControl(value, Validators.required) : new FormControl(value), {emitEvent: false});
    });

    fieldsToRemove.forEach((key) => form.removeControl(key, {emitEvent: false}));
  }
}
