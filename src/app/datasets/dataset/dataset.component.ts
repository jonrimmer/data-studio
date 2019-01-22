import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Dataset } from '../model/dataset';
import { DatasetsState } from '../datasets.reducer';
import { Store } from '@ngrx/store';
import { getDataset } from '../datasets.selectors';

@Component({
  selector: 'ds-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  dataset$: Observable<Dataset> | undefined;

  constructor(private store: Store<DatasetsState>) {}

  ngOnInit() {
    this.dataset$ = this.store.select(getDataset);
  }
}
