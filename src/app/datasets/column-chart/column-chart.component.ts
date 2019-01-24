import { Component, Input, OnChanges, HostBinding, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

type Histogram = {
  lowerBound: number;
  upperBound: number;
  values: number[];
}[];

type Categories = {
  label: string;
  values: number[];
}[];

export interface ChartData {
  series: {
    label: string;
    color: string;
  }[],
  yMax: number;
  yTicks: number[];
  yLabel: string;
  xLabel: string;
  columnCount: number;
  histogram: Histogram | null,
  categories: Categories | null,
}

@Component({
  selector: 'ds-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColumnChartComponent {
  _data: ChartData | undefined;

  histogram: Histogram | null = null;
  categories: Categories | null = null;
  categoryOffset = 3;

  @Input()
  set data(value: ChartData) {
    this._data = value;

    let histColumns = '';

    if (value.histogram && value.histogram.length) {
      this.histogram = value.histogram;
      histColumns = 'hist-start] ' + value.histogram.map(() => '1fr').join(' ') + ' [hist-end ';
      this.categoryOffset = 3 + this.histogram.length;
    }

    let catColumns = '';

    if (value.categories && value.categories.length) {
      this.categories = value.categories;
      catColumns = 'cat-start] ' + value.categories.map(() => '1fr').join(' ') + ' [cat-end';
    }

    // The Angular sanitizer will not accept the grid-line names as safe,
    // so we must bypass the sanitizer in order to the binding to work.
    this.gridTemplateColumns = 
      this.sanitizer.bypassSecurityTrustStyle(
        `30px auto [left ${ histColumns } ${ catColumns } right]`
      );
  }

  @HostBinding('style.grid-template-columns')
  gridTemplateColumns: SafeStyle | undefined;

  constructor(private sanitizer: DomSanitizer) { }
}
