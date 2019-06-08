import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatVerticalStepper } from '@angular/material/stepper';
import { NewDatasetState, Column } from './new-dataset.reducer';
import { Store } from '@ngrx/store';
import { Subscription, Observable } from 'rxjs';
import { getFilePreview, getColumns } from './new-dataset.selectors';
import { FileChosen, CreateDataset, ClearFile, ColumnToggled } from './new-dataset.actions';
import { ParseResult } from 'papaparse';

@Component({
  selector: 'ds-new-dataset',
  templateUrl: './new-dataset.component.html',
  styleUrls: ['./new-dataset.component.scss']
})
export class NewDatasetComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatVerticalStepper, { static: true }) stepper!: MatVerticalStepper;

  reader = new FileReader();

  showProgress = false;
  progress = -1;
  previewSubscription: Subscription | null = null;
  file: File | null = null;
  filePreview$: Observable<ParseResult | null>;
  columns$: Observable<Column[]> | undefined;

  get progressMode() {
    return this.progress < 0 ? 'indeterminate' : 'determinate';
  }

  fileGroup: FormGroup;

  constructor(fb: FormBuilder, private store: Store<NewDatasetState>) {
    this.fileGroup = fb.group({
      filePreviewReady: [null, Validators.requiredTrue]
    });

    this.filePreview$ = this.store.select(getFilePreview);
    this.columns$ = this.store.select(getColumns);
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.previewSubscription = this.filePreview$.subscribe(preview => {
      setTimeout(() => {
        this.fileGroup.patchValue({
          filePreviewReady: !!preview
        });
  
        if (preview && this.stepper.selectedIndex == 0) {
          this.stepper.next();
        }
      });
    });
  }

  ngOnDestroy(): void {
    if (this.previewSubscription) {
      this.previewSubscription.unsubscribe();
    }

    this.store.dispatch(new ClearFile());
  }

  fileSelected(file: File) {
    this.file = file;

    if (file) {
      this.store.dispatch(new FileChosen(file));
    }
  }

  saveDataset() {
    this.store.dispatch(new CreateDataset());
  }

  onToggleColumn(index: number) {
    this.store.dispatch(new ColumnToggled(index));
  }
}
