import { Component, Input, HostBinding, ChangeDetectionStrategy } from '@angular/core';
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

    this.histogram = value.histogram;
    this.categories = value.categories;

    const templateColumns =
      '30px auto ' +
      ((this.histogram && this.histogram.length) ?
        `repeat(${ this.histogram.length }, [hcol-start] 1fr [hcol-end]) ` : '') +
      ((this.categories && this.categories.length) ? 
        `repeat(${ this.categories.length }, [ccol-start] 1fr [ccol-end])` : '');

    // The Angular sanitizer will not accept the grid-line names as safe,
    // so we must bypass the sanitizer in order to the binding to work.
    this.gridTemplateColumns = 
      this.sanitizer.bypassSecurityTrustStyle(templateColumns);
  }

  @HostBinding('style.grid-template-columns')
  gridTemplateColumns: SafeStyle | undefined;

  constructor(private sanitizer: DomSanitizer) { }
}
