import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { DatasetDeleted } from '../datasets.actions';
import { getAllDatasets } from '../datasets.selectors';
import { Observable } from 'rxjs';
import { Dataset } from '../model/dataset';
import { DatasetsState } from '../datasets.reducer';

@Component({
  selector: 'ds-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  datasets$: Observable<Dataset[]> | null = null;

  constructor(private store: Store<DatasetsState>) {}

  ngOnInit() {
    this.datasets$ = this.store.select(getAllDatasets);
  }

  deleteDataset(dataset: Dataset) {
    this.store.dispatch(new DatasetDeleted(dataset.id));
  }
}
