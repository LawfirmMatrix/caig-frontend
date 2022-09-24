import {ComponentRef, Directive, Input, OnDestroy, OnInit, Type, ViewContainerRef} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {ControlType, FieldBase, FieldBaseComponent} from '../fields/field-base';
import {InputComponent} from '../fields/input.component';
import {SelectComponent} from '../fields/select.component';
import {TextareaComponent} from '../fields/textarea.component';
import {ButtonComponent} from '../fields/button.component';
import {CheckboxComponent} from '../fields/checkbox.component';
import {RadioComponent} from '../fields/radio.component';
import {AutocompleteComponent} from '../fields/autocomplete.component';
import {ChipsComponent} from '../fields/chips.component';
import {CurrencyComponent} from '../fields/currency.component';

const componentMapper: {[key in ControlType]: Type<FieldBaseComponent<any>>} = {
  [ ControlType.Input ]: InputComponent,
  [ ControlType.Select ]: SelectComponent,
  [ ControlType.Textarea ]: TextareaComponent,
  [ ControlType.Button ]: ButtonComponent,
  [ ControlType.Checkbox ]: CheckboxComponent,
  [ ControlType.Radio ]: RadioComponent,
  [ ControlType.Autocomplete ]: AutocompleteComponent,
  [ ControlType.Chips ]: ChipsComponent,
  [ ControlType.Currency ]: CurrencyComponent,
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
