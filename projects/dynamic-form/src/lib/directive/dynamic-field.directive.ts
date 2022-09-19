import {ComponentRef, Directive, Input, OnDestroy, OnInit, Type, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ControlType, FieldBase, FieldBaseComponent} from '../fields/field-base';
import {InputComponent} from '../fields/input.component';

const componentMapper: {[key in ControlType]: Type<FieldBaseComponent<any>>} = {
  [ ControlType.Input ]: InputComponent,
  [ ControlType.Select ]: InputComponent,
  [ ControlType.Textarea ]: InputComponent,
  [ ControlType.Button ]: InputComponent,
  [ ControlType.Checkbox ]: InputComponent,
  [ ControlType.Radio ]: InputComponent,
  [ ControlType.Autocomplete ]: InputComponent,
  [ ControlType.Chips ]: InputComponent,
  [ ControlType.Currency ]: InputComponent,
  [ ControlType.PhoneNumber ]: InputComponent,
  [ ControlType.Date ]: InputComponent,
  [ ControlType.DateRange ]: InputComponent,
};

@Directive({ selector: '[dynamicField]' })
export class DynamicFieldDirective implements OnInit, OnDestroy {
  @Input() public field!: FieldBase<any>;
  @Input() public form!: FormGroup;

  public componentRef!: ComponentRef<FieldBaseComponent<any>>;

  constructor(private container: ViewContainerRef) { }

  public ngOnInit() {
    this.componentRef = this.container.createComponent(componentMapper[this.field.controlType]);
    this.componentRef.instance.field = this.field;
    this.componentRef.instance.form = this.form;
  }

  public ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
