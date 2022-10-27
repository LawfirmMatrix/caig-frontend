import {Component, OnInit} from '@angular/core';
import {FieldBase, ControlType, BaseOptions, FieldBaseComponent} from './field-base';
import {Observable, map, shareReplay, BehaviorSubject, combineLatest} from 'rxjs';
import {FormGroup} from '@angular/forms';
import {MatSelect} from '@angular/material/select';

@Component({
  selector: 'dynamic-form-select',
  template: `
    <div fxFlex fxLayout="column" fxLayoutAlign="end end">
      <div fxLayout="row" fxLayoutGap="16px">
        <mat-checkbox *ngIf="field.optionFilter" (change)="filterOptions$.next($event.checked)">
          {{field.optionFilter.label}}
        </mat-checkbox>
        <div *ngIf="field.multiple">
          <mat-checkbox *ngIf="options$ | async as options"
                        class="select-all"
                        [disabled]="!options.length"
                        [indeterminate]="select.value?.length > 0 && select.value?.length < options.length"
                        [checked]="select.value?.length === options.length"
                        (change)="selectAll($event.checked, select)">
            Select All
          </mat-checkbox>
        </div>
      </div>
      <mat-form-field [formGroup]="form" [appearance]="field.appearance" [color]="field.color">
        <mat-label>{{field.label}}</mat-label>
        <mat-select #select [formControlName]="field.key" [multiple]="field.multiple" [required]="field.required">
          <mat-option *ngIf="!field.multiple && field.deselect">--</mat-option>
          <mat-option *ngFor="let option of filteredOptions$ | async"
                      [value]="option[field.itemKey]"
                      [style.color]="field.optionColor ? field.optionColor(option, form) : ''"
                      [disabled]="field.optionDisabled && field.optionDisabled(option, form)">
            {{option[field.displayField]}}
          </mat-option>
        </mat-select>
        <mat-progress-bar *ngIf="!(options$ | async)" mode="indeterminate" [color]="field.color"></mat-progress-bar>
        <mat-hint *ngIf="field.hint" [align]="field.hint.align">{{field.hint.message}}</mat-hint>
        <mat-error *ngIf="control.hasError('required')">
          {{field.label}} is <strong>required</strong>
        </mat-error>
      </mat-form-field>
    </div>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
    }
  `],
})
export class SelectComponent<T> extends FieldBaseComponent<SelectField<T>> implements OnInit {
  public options$!: Observable<T[] | null>;
  public filteredOptions$!: Observable<T[] | null>;
  public filterOptions$ = new BehaviorSubject<boolean>(false);
  public ngOnInit(): void {
    this.options$ = this.field.options.pipe(shareReplay(1));
    this.filteredOptions$ = combineLatest([this.filterOptions$, this.options$])
      .pipe(
        map(([filter, options]) => {
          if (!options || !filter) {
            return options;
          }
          return options.filter((this.field.optionFilter as SelectOptionsFilter<T>).filter);
        })
      );
  }
  public selectAll(checked: boolean, select: MatSelect): void {
    this.control.patchValue(checked ? select.options.map((o) => o.value) : []);
  }
}

export class SelectField<T> extends FieldBase<string | string[]> {
  public controlType = ControlType.Select;
  public options: Observable<T[] | null>;
  public multiple: boolean;
  public deselect: boolean;
  public displayField: keyof T;
  public itemKey: keyof T;
  public optionDisabled: ((option: T, form: FormGroup) => boolean) | undefined;
  public optionColor: ((option: T, form: FormGroup) => string) | undefined;
  public optionFilter: SelectOptionsFilter<T> | undefined;
  constructor(options: SelectOptions<T>) {
    super(options);
    this.multiple = !!options.multiple;
    this.deselect = !!options.deselect;
    this.displayField = options.displayField;
    this.itemKey = options.itemKey;
    this.optionDisabled = options.optionDisabled;
    this.optionColor = options.optionColor;
    this.optionFilter = options.optionFilter;
    this.options = options.options;
  }
}

export interface SelectOptions<T> extends BaseOptions<string | string[]> {
  displayField: keyof T;
  itemKey: keyof T;
  options: Observable<T[] | null>;
  multiple?: boolean;
  deselect?: boolean;
  optionDisabled?: (option: T, form: FormGroup) => boolean;
  optionColor?: (option: T, form: FormGroup) => string;
  optionFilter?: SelectOptionsFilter<T>;
}

export interface SelectOptionsFilter<T> {
  label: string;
  filter: (option: T) => boolean;
}
