import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {FieldBase, FieldPosition} from '../fields/field-base';
import {UntypedFormGroup} from '@angular/forms';
import {FieldControlService} from '../field-control.service';

@Component({
  selector: 'dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css']
})
export class DynamicFormComponent implements OnChanges {
  @Input() public fields: FieldBase<any>[][] | null = null;
  @Input() public model: any | null = null;
  @Input() public form = new UntypedFormGroup({});
  @Input() public showSubmit: boolean = false;
  @Input() public submitPosition: FieldPosition = 'end';
  @Input() public submitLabel: string = 'Submit';

  @Output() public submitted = new EventEmitter<{value: any, rawValue: any}>();

  constructor(private fcs: FieldControlService) { }

  public ngOnChanges(changes: SimpleChanges) {
    const fields = changes['fields'];
    const model = changes['model'];
    if (fields?.currentValue) {
      this.fcs.addControls(this.form, this.fields as FieldBase<any>[][]);
    }
    if (model?.currentValue) {
      this.form.patchValue(this.model, {emitEvent: false});
    }
  }
}
