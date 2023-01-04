import {Component, Input} from '@angular/core';
import {TableColumn} from '../../utils/interfaces';

@Component({
  selector: 'vs-table-currency-cell',
  templateUrl: './currency-cell.component.html',
  styleUrls: ['./currency-cell.component.scss']
})
export class CurrencyCellComponent {
  @Input() public row!: any;
  @Input() public column!: TableColumn<any>;
}
