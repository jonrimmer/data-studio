import { Injectable } from '@angular/core';
import { parse } from 'papaparse';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataProcessorService {
  constructor() { }

  parseFile(file: File) {
    return new Observable(subscriber => {
      
    })
  }
}
