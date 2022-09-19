import {Component, Input, Output, EventEmitter, OnChanges, SimpleChanges} from '@angular/core';
import {FieldBase, FieldPosition} from '../fields/field-base';
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
  @Input() public showSubmit: boolean = false;
  @Input() public submitPosition: FieldPosition = 'end';
  @Input() public submitLabel: string = 'Submit';

  @Output() public submitted = new EventEmitter<{value: any, rawValue: any}>();

  constructor(private fcs: FieldControlService) { }

  public ngOnChanges(changes: SimpleChanges) {
    const fields = changes['fields'];
    const model = changes['model'];
    if (fields?.currentValue) {
      this.fcs.mergeControls(this.form, this.fields as FieldBase<any>[][]);
    }
    // if (fields) {
    //   const maxRows = max(Object.keys(countBy(this.fields, 'length')));
    //   const maxRowsNum = maxRows ? Number(maxRows) : 0;
    //   this.minRowLength = (maxRowsNum * 201) + (((maxRowsNum || 1) - 1) * 8);
    //   if (fields.currentValue) {
    //     this.fcs.mergeControls(this.form, this.fields as FieldBase<any>[][]);
    //   }
    // }
    if (model?.currentValue) {
      this.form?.patchValue(this.model, {emitEvent: false});
    }
  }
}
