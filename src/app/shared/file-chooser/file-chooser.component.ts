import { Component, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ds-file-chooser',
  templateUrl: './file-chooser.component.html',
  styleUrls: ['./file-chooser.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FileChooserComponent,
      multi: true
    }
  ]
})
export class FileChooserComponent implements ControlValueAccessor {
  @ViewChild('fileInput') fileInput!: HTMLInputElement;

  constructor() { }

  onChange: Function | null = null;
  onTouched: Function | null = null;
  fileName: string = '';

  ngOnInit() {
  }

  writeValue(obj: any): void {
    if(obj) {
      // Not possible to write to file input.
    }
    else {
      // Seems to be the only way to clear an input[type=file]
      (this.fileInput.value as any) = null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  filesChanged(files: FileList) {
    if (this.onChange) {
      this.onChange(files.length ? files[0] : null);
    }
  }
}
