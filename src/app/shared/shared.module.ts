import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectFormDirective } from './connect-form.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FileChooserComponent } from './file-chooser/file-chooser.component';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FileSizePipe } from './filesize.pipe';

const DECLARATIONS = [
  ConnectFormDirective,
  FileChooserComponent,
  FileSizePipe
];

const IMPORTS = [
  CommonModule,
  MatToolbarModule,
  MatButtonModule,
  MatProgressBarModule,
  MatStepperModule,
  MatTableModule,
  MatCardModule,
  MatIconModule,
  MatCheckboxModule,
  FormsModule,
  ReactiveFormsModule,
]

@NgModule({
  declarations: DECLARATIONS,
  imports: IMPORTS,
  exports: [
    ...IMPORTS,
    ...DECLARATIONS
  ]
})
export class SharedModule { }
