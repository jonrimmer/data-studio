import { Component, OnInit, Input, OnChanges, HostBinding } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'ds-column-chart',
  templateUrl: './column-chart.component.html',
  styleUrls: ['./column-chart.component.scss']
})
export class ColumnChartComponent implements OnChanges {
  @Input()
  chart: { 
    label: string;
    value: number;
  }[] | undefined;

  yScale: (v: number) => number = v => v;

  @HostBinding('style.grid-template-columns')
  gridTemplateColumns: SafeStyle | undefined;

  yTicks: number[] = [];

  constructor(private sanitizer: DomSanitizer) { }

  ngOnChanges() {
    if (this.chart) {
      this.gridTemplateColumns = 
        this.sanitizer.bypassSecurityTrustStyle(`30px auto [left] ${ this.chart.map(() => '1fr').join(' ') } [right]`);
      console.log(this.gridTemplateColumns);

      let max = Math.max(...this.chart.map(d => d.value));

      const mag = Math.pow(10, Math.floor(Math.log10(max) - 1));
      max = Math.ceil(max / mag) * mag;

      this.yScale = v => ((v / max) * 100);

      this.yTicks = Array.from({ length: 10 }, (_, i) => Math.round(((9 - i) / 9) * max));
    }
  }
}
