import { createFeatureSelector, createSelector } from '@ngrx/store';
import { DatasetsState } from './datasets.reducer';
import * as fromDataset from './datasets.reducer';
import { getRouterState } from '../store/app.selectors';
import { Column, ColumnValues } from './model/dataset';
import { ChartData } from './column-chart/column-chart.component';

export const getDatasets = createFeatureSelector<DatasetsState>('datasets');

export const allDatasetsLoaded = createSelector(getDatasets, state => state.allDatasetsLoaded);

export const getAllDatasets = createSelector(getDatasets, fromDataset.selectAll); 
export const getDatasetById = (id: number) => createSelector(getDatasets, state => state.entities[id]);

export const getDataset = createSelector(
  getRouterState,
  getDatasets,
  (router, datasets) => datasets.entities[router.state.params.datasetId]
);

export const getColumn = createSelector(
  getRouterState,
  getDataset,
  (router, dataset) => dataset.columns[router.state.params.columnId]
);

export function columnValuesToChartData(values: ColumnValues): ChartData {
  let yMax = Math.max(...[
    ...values.continuous,
    ...values.categorical
  ].map(c => c.frequency));

  // Try to get a 'nicer' value for the y axis by rounding up the 2nd figure. E.g. 115 -> 120. 
  const mag = Math.pow(10, Math.floor(Math.log10(yMax) - 1));
  yMax = Math.ceil(yMax / mag) * mag;

  // Because we are using percentages within a CSS grid to render the chart,
  // we only need to map domain values to the range 0 to 100.
  const yScale = (v: number) => ((v / yMax) * 100);

  const yTicks = Array.from({ length: 10 }, (_, i) => Math.round(((9 - i) / 9) * yMax));

  const histogram = (values.continuous && values.continuous.length) ?
    values.continuous.map(({ lowerBound, upperBound, frequency }) => ({
      lowerBound,
      upperBound,
      values: [ yScale(frequency) ]
    })) : null;

  const categories = (values.categorical && values.categorical.length) ?
    values.categorical.map(({ value: label, frequency }) => ({
      label,
      values: [ yScale(frequency) ]
    })) : null;
  
  return {
    series: [
      {
        label: 'Frequency',
        color: 'var(--dsPrimary100)'
      }
    ],
    yMax,
    yTicks,
    yLabel: 'Frequency',
    xLabel: '',
    columnCount: values.categorical.length + values.continuous.length,
    histogram,
    categories 
  }
}

export const getColumnChart = createSelector(
  getColumn,
  column => column ? columnValuesToChartData(column.values) : null
)