import { Injectable } from '@angular/core';
import { Dataset } from '../model/dataset';
import { jsonpCallbackContext } from '@angular/common/http/src/module';

const storage: Storage = window.localStorage;

@Injectable()
export class DatasetsService {

  get nextId() {
    return parseInt(storage['datasets.nextid']);
  }
  
  set nextId(value: number) {
    storage['datasets.nextid'] = value.toString();
  }

  constructor() {
    storage['datasets.id']

    if (Number.isNaN(this.nextId)) {
      this.nextId = 1;
    }
  }

  getNextId() {
    let id = this.nextId;
    this.nextId += 1;
    return id;
  }

  loadAllDatasets(): Dataset[] {
    let json = storage['datasets']

    if (!json) {
      json = storage['datasets'] = JSON.stringify([]);
    }

    const result = JSON.parse(json) as Dataset[];

    return result;
  }

  saveAllDatasets(all: Dataset[]) {
    storage['datasets'] = JSON.stringify(all);
  }
}