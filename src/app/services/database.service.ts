import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type StoreName = 'routes'|'analytics';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbName = 'SupplyChainApp';
  private dbVersion = 1;
  private db!: IDBDatabase;
  private stores:StoreName[] = ['routes']

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initDB();
    } else {
      console.log('Running on server-side, skipping indexedDB initialization');
    }
  }

  /**
   * Initialize IndexedDB and set up object stores.
   */
  private initDB(): void {
    if (isPlatformBrowser(this.platformId)) {

      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.stores.forEach((store) => {

          if (!db.objectStoreNames.contains(store)) {
            db.createObjectStore(store, { keyPath: 'id', autoIncrement: true });
          }
        })
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        console.info('Database initialized');
      };

      request.onerror = (event) => {
        console.error('Database error:', (event.target as IDBOpenDBRequest).error);
      };
    } else {
      console.log('Running on server-side, skipping indexedDB initialization');
    }
  }

  /**
   * Add a record to the specified object store.
   */
  addData(storeName: StoreName, data: any): Observable<number> {
    return new Observable<number>((observer) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = (event: Event) => {
        observer.next((event.target as IDBRequest).result as number); // Return the new ID
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Get a record by key from the specified object store.
   */
  getRecord(storeName: StoreName, key: any): Observable<any> {
    return new Observable<any>((observer) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
  
      request.onsuccess = (event: Event) => {
        const result = (event.target as IDBRequest).result;
        if (result) {
          observer.next(result); // Emit the fetched record
        } else {
          observer.error(`Record with key ${key} not found in store ${storeName}`);
        }
        observer.complete();
      };
  
      request.onerror = (event: Event) => {
        observer.error((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Get all records from the specified object store.
   */
  getAllRecords(storeName: StoreName): Observable<any[]> {
    return new Observable<any[]>((observer) => {
      const transaction = this.db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = (event: Event) => {
        observer.next((event.target as IDBRequest).result);
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error((event.target as IDBRequest).error);
      };
    });
  }

  /**
   * Delete a record by key from the specified object store.
   */
  deleteData(storeName: StoreName, id: number): Observable<void> {
    return new Observable<void>((observer) => {
      const transaction = this.db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        observer.next();
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error((event.target as IDBRequest).error);
      };
    });
  }
}
