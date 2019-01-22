import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Column } from '../model/dataset';
import { DatasetsState } from '../datasets.reducer';
import { Store } from '@ngrx/store';
import { getColumn } from '../datasets.selectors';

@Component({
  selector: 'ds-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.scss']
})
export class ColumnComponent implements OnInit {
  column$: Observable<Column> | null = null;

  constructor(private store: Store<DatasetsState>) { }

  ngOnInit() {
    this.column$ = this.store.select(getColumn);
  }
}
