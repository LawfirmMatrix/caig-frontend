import {Component, OnInit} from '@angular/core';
import {
  FieldBase,
  InputField,
  SelectField,
  TextareaField,
  ButtonField,
  CheckboxField,
  RadioField,
  AutocompleteField,
  ChipsField,
  CurrencyField,
} from 'dynamic-form';
import {FormGroup} from '@angular/forms';
import {of} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'test1',
        label: 'Test 1',
        required: true,
        buttons: [
          {
            icon: 'home',
            callback: (x) => console.log(x),
            tooltip: 'Home',
          },
          {
            icon: 'check',
            callback: (x) => console.log(x),
            tooltip: 'Check',
          }
        ],
        menu: {
          icon: 'more_vert',
          items: [
            {
              icon: 'home',
              callback: () => console.log('test'),
              name: 'Home',
            }
          ],
        },
      }),
      new InputField({
        key: 'test2',
        label: 'Test 2',
      }),
      new InputField({
        key: 'test4',
        label: 'Test 4',
      }),
      new InputField({
        key: 'test5',
        label: 'Test 5',
      }),
      new InputField({
        key: 'test6',
        label: 'Test 6',
      }),
      new InputField({
        key: 'test7',
        label: 'Test 7',
      }),
      new InputField({
        key: 'test8',
        label: 'Test 8',
      }),
      new InputField({
        key: 'test9',
        label: 'Test 9',
        required: true,
      }),
    ],
    [
      new InputField({
        key: 'test3',
        label: 'Test 3',
      }),
      new InputField({
        key: 'test0',
        label: 'Test 0',
      }),
      new CheckboxField({
        key: 'aaa',
        label: 'AAA',
      }),
      new RadioField({
        key: 'radio',
        label: 'Radio',
        options: of([
          { key: 'a', value: 'A' },
          { key: 'b', value: 'B' },
          { key: 'c', value: 'C' },
        ]),
        fxLayout: 'row',
      })
    ],
    [
      new SelectField({
        key: 'select1',
        label: 'Select 1',
        options: of([
          { key: 'a', value: 'A' },
          { key: 'b', value: 'B' },
        ]),
        displayField: 'value',
        itemKey: 'key',
        deselect: true,
        optionFilter: {
          label: 'what',
          filter: (o) => o.key !== 'a',
        },
        multiple: true,
      }),
      new InputField({
        key: 'test99',
        label: 'Test 99',
      }),
      new ButtonField({
        callback: () => console.log('test2'),
        label: 'Test2',
        key: '',
      })
    ],
    [
      new TextareaField({
        key: 'textarea',
        label: 'Text Area',
        placeholder: 'Type here!',
      }),
      new ButtonField({
        callback: () => console.log('test'),
        label: 'Test',
        key: '',
      }),
      new CheckboxField({
        label: 'Check Me!',
        key: 'checkbox',
      })
    ],
    [
      new AutocompleteField({
        label: 'Employee',
        key: 'employeeId',
        options: of([
          { id: 1, name: 'Employee 1' },
          { id: 2, name: 'Employee 2' },
          { id: 3, name: 'Employee 3' },
        ]),
        displayField: 'name',
        itemKey: 'id',
      }),
    ],
    [
      new ChipsField({
        label: 'Chips Freeform',
        key: 'chips1',
      }),
      new ChipsField({
        label: 'Chips Autocomplete',
        key: 'chips2',
        options: of(['ABC', '123', 'Blah']),
      }),
    ],
    [
      new CurrencyField({
        label: 'MONEYS',
        key: 'currency',
      }),
    ]
  ];
  public form = new FormGroup({});

  public ngOnInit() {
    this.form.valueChanges.subscribe((x) => console.log(x));
  }

  public onSubmit(event: any): void {
    console.log(event);
  }
}
