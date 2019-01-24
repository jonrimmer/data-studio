import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Column, ColumnType } from '../model/dataset';
import { UNIQUE_COUNT_LIMIT } from 'src/app/processor/chart-constants';

@Component({
  selector: 'ds-columns-table',
  templateUrl: './columns-table.component.html',
  styleUrls: ['./columns-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnsTableComponent {
  @Input()
  columns: Column[] | null = null;

  ColumnType = ColumnType;

  uniqueLimit: number = UNIQUE_COUNT_LIMIT;

  displayedColumns = ['name', 'type', 'unique', 'min', 'max', 'avg'];

  constructor() { }
}
