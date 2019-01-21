import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Params } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Column } from '../model/dataset';

@Component({
  selector: 'ds-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {
  column$: Observable<Column> | null = null;;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.column$ = combineLatest(
      this.route.data.pipe(map<Data, Column[]>(data => data.dataset.columns)),
      this.route.params.pipe(map<Params, number>(params => params.columnId))
    ).pipe(map(([columns, id]) => {
      return columns[id];
    }));
  }
}
