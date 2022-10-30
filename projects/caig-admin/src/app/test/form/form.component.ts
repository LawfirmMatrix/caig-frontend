import {Component, OnInit, AfterViewInit} from '@angular/core';
import {UntypedFormGroup, Validators} from '@angular/forms';
import {FieldBase, InputField} from 'dynamic-form';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, AfterViewInit {
  public form = new UntypedFormGroup({});
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'text',
        label: 'Text',
        required: true,
        validators: [
          Validators.maxLength(10),
        ]
      })
    ]
  ];
  public model: any = {
    text: 'test',
  };

  public ngOnInit() {
    this.form.valueChanges.subscribe(console.log);
    this.form.statusChanges.subscribe(console.log);
  }

  public ngAfterViewInit() {
  }
}
