import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Column } from '../model/dataset';
import { map, filter } from 'rxjs/operators';

@Component({
  selector: 'ds-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  columns$: Observable<Column[]> | null = null;
  title$: Observable<string> = of('Loading...');

  ngOnInit() {
    this.title$ = this.route.data.pipe(
      filter(data => !!data),
      map(data => data.dataset.filename)
    );

    this.columns$ = this.route.data.pipe(
      map(data => data.dataset.columns)
    );
  }
}
