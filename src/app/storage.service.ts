import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  storeData(key: string, value: any): void {
    const storedData = this.retrieveData(key);
    const updatedData = storedData ? [...storedData, value] : [value];
    localStorage.setItem(key, JSON.stringify(updatedData));
  }

  retrieveData(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
}
