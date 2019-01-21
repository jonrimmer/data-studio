import { Component, OnInit, Input, OnChanges, HostBinding } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ds-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent implements OnChanges {
  @Input()
  chart: { [key: string]: number} | undefined;

  data: [string, number][] = [];

  yScale: (v: number) => number = v => v;

  @HostBinding('style.grid-template-columns')
  gridTemplateColumns: SafeStyle | undefined;

  yTicks: number[] = [];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges() {
    if (this.chart) {
      this.data = Object.entries(this.chart);
      this.gridTemplateColumns = 
        this.sanitizer.bypassSecurityTrustStyle(`30px auto [left] ${ this.data.map(() => '1fr').join(' ') } [right]`);
      console.log(this.gridTemplateColumns);

      let max = Math.max(...this.data.map(d => d[1]));

      const mag = Math.pow(10, Math.floor(Math.log10(max) - 1));
      max = Math.ceil(max / mag) * mag;

      this.yScale = v => ((v / max) * 100);

      this.yTicks = Array.from({ length: 10 }, (_, i) => Math.round(((9 - i) / 9) * max));
    }
  }
}
