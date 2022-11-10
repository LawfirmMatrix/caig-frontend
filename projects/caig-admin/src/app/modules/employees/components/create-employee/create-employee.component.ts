import {Component} from '@angular/core';
import {FieldBase, InputField} from 'dynamic-form';
import {UntypedFormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';
import {EmployeeEntityService} from '../../services/employee-entity.service';
import {RespondentEntityService} from '../../../surveys/services/respondent-entity.service';

@Component({
  selector: 'app-create-employee',
  templateUrl: './create-employee.component.html',
  styleUrls: ['./create-employee.component.scss']
})
export class CreateEmployeeComponent {
  public fields: FieldBase<any>[][] = [
    [
      new InputField({
        key: 'firstName',
        label: 'First Name',
        required: true,
      }),
    ],
    [
      new InputField({
        key: 'middleName',
        label: 'Middle Name/Initial',
      }),
    ],
    [
      new InputField({
        key: 'lastName',
        label: 'Last Name',
        required: true,
      }),
    ],
    [
      new InputField({
        key: 'ssn',
        label: 'SSN',
      })
    ]
  ];
  public form = new UntypedFormGroup({});
  public showSubmit = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeEntityService,
    private respondentService: RespondentEntityService,
  ) {
  }
  public submit(payload: any): void {
    this.showSubmit = false;
    const respondentId = (this.route.snapshot.queryParams as any).respondentId;
    this.employeeService.add(payload, {isOptimistic: false})
      .pipe(
        switchMap((employee) => {
          return respondentId ?
            this.respondentService.patch(respondentId, {employeeId: employee.id}) :
            of(void 0);
        })
      )
      .subscribe(() => {
        const redirect = respondentId ? '/respondents' : '/employees';
        this.router.navigate([redirect]);
      }, () => this.showSubmit = true);
  }
}
