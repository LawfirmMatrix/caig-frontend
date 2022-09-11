import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {ColumnFilter} from '../column-filter';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'vs-table-number-filter',
  templateUrl: './number-filter.component.html',
  styleUrls: ['./number-filter.component.scss']
})
export class NumberFilterComponent implements OnInit, OnChanges {
  @Input() public disabled!: boolean;
  @Input() public field!: string;
  @Input() public columnFilter$!: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  public form!: FormGroup<{start: FormControl<number | null>, end: FormControl<number | null>}>;
  public ngOnInit() {
    this.form = this.columnFilter$.value[this.field].range;
    this.form.valueChanges
      .pipe(debounceTime(200))
      .subscribe(() => this.columnFilter$.next(this.columnFilter$.value));
  }
  public ngOnChanges(changes: SimpleChanges) {
    const disabled = changes['disabled'];
    const columnFilter$ = changes['columnFilter$'];
    if (disabled || columnFilter$) {
      if (this.form) {
        const action = this.disabled ? 'disable' : 'enable';
        this.form[action]();
      }
    }
  }
}
