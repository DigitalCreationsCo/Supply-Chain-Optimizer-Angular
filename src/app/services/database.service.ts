import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, throwError } from 'rxjs';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type StoreName = 'routes'|'analytics';

interface DatabaseState {
  initialized: boolean;
  error?: Error;
}

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private dbName = 'SupplyChainApp';
  private dbVersion = 1;
  private stores:StoreName[] = ['routes']
  
  private db$ = new BehaviorSubject<IDBDatabase | null>(null);
  private dbState$ = new BehaviorSubject<DatabaseState>({ initialized: false });

  // Expose database state as an observable
  public databaseReady$ = this.dbState$.asObservable().pipe(
    map(state => state.initialized)
  );

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initDB().subscribe({
        error: (error) => {
          console.error('Failed to initialize database:', error);
          this.dbState$.next({ initialized: false, error });
        }
      });
    }
  }

  /**
   * Initialize IndexedDB and set up object stores.
   */
  private initDB(): Observable<IDBDatabase> {
    return new Observable(observer => {
      if (!isPlatformBrowser(this.platformId)) {
        observer.error(new Error('IndexedDB is not available in server-side rendering'));
        return;
      }

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
        const db = (event.target as IDBOpenDBRequest).result;
        this.db$.next(db);
        this.dbState$.next({ initialized: true });
        observer.next(db);
        observer.complete();
      };

      request.onerror = (event) => {
        const error = (event.target as IDBOpenDBRequest).error;
        observer.error(error);
      };
    })
  }

  private getDatabase(): Observable<IDBDatabase> {
    return this.db$.pipe(
      switchMap(db => {
        if (db) return from([db]);
        return this.initDB();
      }),
      catchError(error => throwError(() => new Error(`Database not available: ${error.message}`)))
    );
  }
  
  /**
   * Add a record to the specified object store.
   */
  addData(storeName: StoreName, data: any): Observable<number> {
    console.debug('database service:addData:store:', storeName,':data:',data)
    return this.getDatabase().pipe(
      switchMap(db => new Observable<number>(observer => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = (event) => {
        const id = (event.target as IDBRequest).result as number;
        observer.next(id);
        observer.complete();
      };

      request.onerror = (event: Event) => {
        console.log('database service:request.onerror: ', event)
        observer.error((event.target as IDBRequest).error);
      };

      // Handle transaction errors
      transaction.onerror = (event) => {
        console.log('database service:transaction.onerror: ', event)
        observer.error(new Error(`Transaction error: ${transaction.error}`));
      };
    })),
    catchError(error => throwError(() => new Error(`Failed to add data: ${error.message}`)))
    );
  }


  /**
   * Get a record by key from the specified object store.
   */
  getRecord(storeName: StoreName, key: any): Observable<any> {
    return this.getDatabase().pipe(
      switchMap(db => new Observable(observer => {
      const transaction = db.transaction(storeName, 'readonly');
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
  
      request.onerror = (event) => {
        observer.error((event.target as IDBRequest).error);
      };
    })),
    catchError(error => throwError(() => new Error(`Failed to get record: ${error.message}`)))
  );
}

  /**
   * Get all records from the specified object store.
   */
  getAllRecords(storeName: StoreName): Observable<any[]> {
    return this.getDatabase().pipe(
      switchMap(db => new Observable<any[]>(observer => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = (event: Event) => {
        observer.next((event.target as IDBRequest).result);
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error((event.target as IDBRequest).error);
      };
    })),
    catchError(error => throwError(() => new Error(`Failed to get all records: ${error.message}`)))
  );
}

  /**
   * Delete a record by key from the specified object store.
   */
  deleteData(storeName: StoreName, id: number): Observable<void> {
    return this.getDatabase().pipe(
      switchMap(db => new Observable<void>(observer => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(id);

      request.onsuccess = () => {
        observer.next();
        observer.complete();
      };

      request.onerror = (event: Event) => {
        observer.error((event.target as IDBRequest).error);
      };
    })),
    catchError(error => throwError(() => new Error(`Failed to delete data: ${error.message}`)))
  );
}
}
