import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Column } from '../model/dataset';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'ds-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {
  constructor(private route: ActivatedRoute) { }

  columns$: Observable<Column[]> | null = null;

  ngOnInit() {
    this.columns$ = this.route.data.pipe(
      map(data => data.dataset.columns)
    );
  }
}
