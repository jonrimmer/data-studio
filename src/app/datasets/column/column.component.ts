import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../model/dataset';
import { DatasetsState } from '../datasets.reducer';
import { Store } from '@ngrx/store';
import { getColumn, getColumnChart } from '../datasets.selectors';
import { ChartData } from '../column-chart/column-chart.component';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'ds-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {
  column$: Observable<Column> | null = null;
  chartData$?: Observable<ChartData>;

  constructor(private store: Store<DatasetsState>) { }

  ngOnInit() {
    this.column$ = this.store.select(getColumn);
    this.chartData$ = this.store.select(getColumnChart).pipe(tap(value => {
      console.dir(value);
    }));
  }
}
