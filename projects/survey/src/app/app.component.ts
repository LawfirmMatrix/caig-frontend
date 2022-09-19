import {Component, OnInit} from '@angular/core';
import {FieldBase, InputField} from 'dynamic-form';
import {FormGroup} from '@angular/forms';

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
