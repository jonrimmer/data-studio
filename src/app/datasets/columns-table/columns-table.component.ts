import { Component, OnInit, Input } from '@angular/core';
import { Column } from '../model/dataset';

@Component({
  selector: 'ds-columns-table',
  templateUrl: './columns-table.component.html',
  styleUrls: ['./columns-table.component.scss']
})
export class ColumnsTableComponent implements OnInit {
  @Input()
  columns: Column[] | null = null;

  displayedColumns = ['name', 'min', 'max', 'avg'];

  constructor() { }

  ngOnInit() {
  }

}
