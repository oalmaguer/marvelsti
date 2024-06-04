import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  storeData(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  retrieveData(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }
}
