import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ParseResult } from 'papaparse';
import { Column } from '../new-dataset/new-dataset.reducer';

@Component({
  selector: 'ds-parse-result-viewer',
  templateUrl: './parse-result-viewer.component.html',
  styleUrls: ['./parse-result-viewer.component.scss']
})
export class ParseResultViewerComponent {
  @Input()
  rows: any[] = [];

  @Input()
  set columns(columns: Column[]) {
    this._columns = columns;
    this.tableColumns = columns.filter(c => c.included).map(c => c.name);
  }

  _columns: Column[] | undefined;
  tableColumns: string[] = [];

  @Output()
  toggleColumn = new EventEmitter<number>();
}
