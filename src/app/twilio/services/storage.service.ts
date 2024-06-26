import { Injectable } from '@angular/core';

export type StorageKey = 'audioInputId' | 'audioOutputId' | 'videoInputId';

@Injectable()
export class StorageService {
  get(key: StorageKey): string {
    return localStorage.getItem(this.formatAppStorageKey(key));
  }

  set(key: StorageKey, value: string): void {
    if (value && value !== 'null') {
      localStorage.setItem(this.formatAppStorageKey(key), value);
    }
  }

  remove(key: StorageKey): void {
    localStorage.removeItem(this.formatAppStorageKey(key));
  }

  private formatAppStorageKey(key: StorageKey): string {
    return `chc.twilio.${key}`;
  }
}
