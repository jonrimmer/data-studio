import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { RouterModule, Route } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DatasetComponent } from './dataset/dataset.component';
import { reducer as datasetsReducer } from './datasets.reducer';
import { reducer as newDatasetReducer } from './new-dataset/new-dataset.reducer';
import { NewDatasetEffects } from './new-dataset/new-dataset.effects';
import { EffectsModule } from '@ngrx/effects';
import { DatasetsEffects } from './datasets.effects';
import { NewDatasetComponent } from './new-dataset/new-dataset.component';
import { ParseResultViewerComponent } from './parse-result-viewer/parse-result-viewer.component';
import { DatasetGuard } from './services/dataset.guard';
import { ColumnComponent } from './column/column.component';
import { ColumnsTableComponent } from './columns-table/columns-table.component';
import { ColumnChartComponent } from './column-chart/column-chart.component';

const ROUTES: Route[] = [
  {
    path: '',
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'new',
        component: NewDatasetComponent
      },
      {
        path: ':datasetId',
        canActivate: [DatasetGuard],
        children: [
          {
            path: '',
            component: DatasetComponent
          },
          {
            path: 'column/:columnId',
            component: ColumnComponent
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('datasets', datasetsReducer),
    EffectsModule.forFeature([DatasetsEffects]),
    StoreModule.forFeature('newDataset', newDatasetReducer),
    EffectsModule.forFeature([NewDatasetEffects])
  ],
  declarations: [
    DatasetComponent,
    HomeComponent,
    ParseResultViewerComponent,
    NewDatasetComponent,
    ColumnComponent,
    ColumnsTableComponent,
    ColumnChartComponent
  ],
  providers: [DatasetGuard]
})
export class DatasetsModule {}
