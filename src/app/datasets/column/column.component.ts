import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../model/dataset';
import { DatasetsState } from '../datasets.reducer';
import { Store } from '@ngrx/store';
import { getColumn, getColumnChart } from '../datasets.selectors';
import { ChartData } from '../column-chart/column-chart.component';

@Component({
  selector: 'ds-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent {
  column$: Observable<Column>;
  chartData$?: Observable<ChartData | null>;

  constructor(private store: Store<DatasetsState>) {
    this.column$ = this.store.select(getColumn);
    this.chartData$ = this.store.select(getColumnChart);
  }
}
