import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Moment} from 'moment';
import {BehaviorSubject, debounceTime} from 'rxjs';
import {FormControl, FormGroup} from '@angular/forms';
import {ColumnFilter} from '../column-filter';

@Component({
  selector: 'vs-table-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit, OnChanges {
  @Input() public disabled!: boolean;
  @Input() public field!: string;
  @Input() public columnFilter$!: BehaviorSubject<{ [key: string]: ColumnFilter }>;
  public form!: FormGroup<{start: FormControl<Moment | null>, end: FormControl<Moment | null>}>;
  public ngOnInit() {
    this.form = this.columnFilter$.value[this.field].range;
    this.form.valueChanges
      .pipe(debounceTime(100))
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
