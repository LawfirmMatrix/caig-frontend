import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'vs-table-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnInit {
  @Output() public dateChange = new EventEmitter<{start: string | null, end: string | null}>();
  @Input() public range = new FormGroup<{start: FormControl<any>; end: FormControl<any>}>({
    start: new FormControl<any>(null),
    end: new FormControl<any>(null),
  });
  public ngOnInit() {
    // const formatString = (value?: Moment | null) => value ? value.format('YYYY-MM-DD') : null;
    // this.range.valueChanges
    //   .pipe(debounceTime(100))
    //   .subscribe((value) => {
    //     console.log(value.start, value.end);
    //     // this.dateChange.emit({
    //     //   start: formatString(value.start),
    //     //   end: formatString(value.end)
    //     // });
    //   });
  }
}
