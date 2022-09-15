import {Component, OnInit} from '@angular/core';
import {FieldBase, DropdownQuestion, TextboxQuestion} from 'dynamic-form';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public fields: FieldBase<any>[][] = [
    [
      new DropdownQuestion({
        key: 'brave',
        label: 'Bravery Rating',
        options: [
          {key: 'solid',  value: 'Solid'},
          {key: 'great',  value: 'Great'},
          {key: 'good',   value: 'Good'},
          {key: 'unproven', value: 'Unproven'}
        ],
        order: 3
      }),

      new TextboxQuestion({
        key: 'firstName',
        label: 'First name',
        value: 'Bombasto',
        required: true,
        order: 1
      }),

      new TextboxQuestion({
        key: 'emailAddress',
        label: 'Email',
        type: 'email',
        order: 2
      })
    ],
  ];
  public form = new FormGroup({});

  public ngOnInit() {
    this.form.valueChanges.subscribe((x) => console.log(x));
  }

  public onSubmit(event: any): void {
    console.log(event);
  }
}
