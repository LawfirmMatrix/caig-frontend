import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {every} from 'lodash-es';
import {UntypedFormGroup} from '@angular/forms';

@Component({
  selector: 'app-password-requirements',
  template: `
    <div fxLayout="column" fxLayoutGap="5px" class="password-requirements-backdrop">
      <div fxFlex fxLayout="column" fxLayoutGap="5px" *ngFor="let check of checks">
        <div fxLayout="row" fxLayoutGap="5px" [ngClass]="{'required': !check.valid, 'completed': check.valid}">
          <mat-icon class="password-requirements-icon">{{check.valid ? 'check_circle' : 'cancel'}}</mat-icon>
          <span fxFlex>{{check.description}}</span>
        </div>
        <div *ngFor="let subCheck of check.requirements" fxLayout="row" fxLayoutGap="5px"
             class="password-requirements-indented" [ngClass]="{'completed': subCheck.valid}">
          <mat-icon
            class="password-requirements-icon">{{subCheck.valid ? 'check_circle' : 'radio_button_unchecked'}}</mat-icon>
          <span fxFlex>{{subCheck.description}}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .password-requirements-backdrop {
      font-size: small;
      width: 300px;
      padding: 10px;
    }

    .password-requirements-icon {
      font-size: 18px;
    }

    .password-requirements-indented {
      margin-left: 30px;
    }

    .completed {
      color: #2ECC40;
    }

    .required {
      color: #FF4136;
    }
  `],
})
export class PasswordRequirementsComponent implements OnInit {
  @Input() public form!: UntypedFormGroup;
  @Output() public isValid = new EventEmitter<boolean>(true);
  private subCheckRequirements: PasswordRequirement[] = [
    {
      description: 'Lower case letters (a-z)',
      validation: (password) => /[a-z]/.test(password),
    },
    {
      description: 'Upper case letters (A-Z)',
      validation: (password) => /[A-Z]/.test(password),
    },
    {
      description: 'Numbers (i.e. 0-9)',
      validation: (password) => /\d/.test(password),
    },
    {
      description: 'Special characters (e.g. !@#$%^&*)',
      validation: (password) => /\W|_/g.test(password),
    },
  ];
  public checks: PasswordRequirement[] = [
    {
      description: 'At least 8 characters in length',
      validation: (password) => password.length >= 8,
    },
    {
      description: 'Contains at least 3 of the following 4 types of characters:',
      validation: (password) => this.subCheckRequirements.filter((requirement) => requirement.valid).length >= 3,
      requirements: this.subCheckRequirements,
    },
    {
      description: 'Confirmation password must match new password',
      validation: (password) => password === this.form.value.confirmPassword,
    }
  ];
  public ngOnInit() {
    this.form.valueChanges
      .subscribe((value) => {
        checkRequirements(value.password, this.checks);
        this.isValid.emit(every(this.checks, 'valid'));
      });
  }
}

interface PasswordRequirement {
  description: string;
  validation: (password: string) => boolean;
  valid?: boolean;
  requirements?: PasswordRequirement[];
}


function checkRequirements(value: string, checks: PasswordRequirement[]): void {
  checks.forEach((check) => {
    if (check.requirements) {
      checkRequirements(value, check.requirements);
    }
    check.valid = value ? check.validation(value) : false;
  });
}

