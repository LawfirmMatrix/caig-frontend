import {Component, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-filter-toggles',
  templateUrl: './filter-toggles.component.html',
  styleUrls: ['./filter-toggles.component.scss']
})
export class FilterTogglesComponent {
  @Output() public filterOptions = new EventEmitter<boolean>();
  @Output() public inverseFilter = new EventEmitter<boolean>();
}
