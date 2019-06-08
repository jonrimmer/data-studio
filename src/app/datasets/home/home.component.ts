import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getAllDatasets } from '../datasets.selectors';
import { Observable } from 'rxjs';
import { Dataset } from '../model/dataset';
import { DatasetsState } from '../datasets.reducer';
import { datasetDeleted } from '../datasets.actions';

@Component({
  selector: 'ds-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  datasets$: Observable<Dataset[]> | null = null;

  constructor(private store: Store<DatasetsState>) {
    this.datasets$ = this.store.select(getAllDatasets);
  }

  deleteDataset(dataset: Dataset) {
    this.store.dispatch(datasetDeleted({ id: dataset.id }));
  }
}
