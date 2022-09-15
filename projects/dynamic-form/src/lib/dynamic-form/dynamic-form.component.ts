import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {FieldBase} from '../fields/field-base';
import {FormGroup} from '@angular/forms';
import {FieldControlService} from '../field-control.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnChanges {
  @Input() public fields: FieldBase<any>[][] | null = null;
  @Input() public model: any | null = null;
  @Input() public form = new FormGroup({});

  @Output() public formSubmit = new EventEmitter<{value: any, rawValue: any}>();

  constructor(private fcs: FieldControlService) { }

  public ngOnChanges(changes: SimpleChanges) {
    const fields = changes['fields'];
    const model = changes['model'];
    if (fields?.currentValue) {
      this.fcs.mergeControls(this.form, this.fields as FieldBase<any>[][]);
    }
    if (model?.currentValue) {
      this.form?.patchValue(this.model, {emitEvent: false});
    }
  }
}
