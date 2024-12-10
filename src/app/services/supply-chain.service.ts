import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, forkJoin, from, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { RouteSegment, SupplyChainRoute } from '../models/route.model';
import { DatabaseService } from './database.service';
import { SegmentAnalytics, SupplyChainAnalytics } from '../models/analytics.model';
import { RouteService } from './route.service';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {
  
  private routesSubject = new BehaviorSubject<SupplyChainRoute[]>([]);
  public routes$ = this.routesSubject.asObservable();

  public analyticsSubject = new BehaviorSubject<SupplyChainAnalytics[]>([])
  public analytics$ = this.analyticsSubject.asObservable()

  constructor(private databaseService: DatabaseService, private routeService: RouteService) {
    // Initialize routes when the database is ready
    this.loadInitialRoutes();
  }


  private loadInitialRoutes(): void {
    this.databaseService.databaseReady$.pipe(
      switchMap(ready => {
        if (ready) {
          return this.databaseService.getAllRecords('routes');
        }
        return from([[]]);
      })
    ).subscribe({
      next: (routes: SupplyChainRoute[]) => this.routesSubject.next(routes),
      error: (error) => console.error('Error loading routes:', error)
    });

    this.databaseService.databaseReady$.pipe(
      switchMap(ready => {
        if (ready) {
          return this.databaseService.getAllRecords('sc-analytics');
        }
        return from([[]]);
      })
    ).subscribe({
      next: (analytics: SupplyChainAnalytics[]) => this.analyticsSubject.next(analytics),
      error: (error) => console.error('Error loading sc-analytics:', error)
    });
  }

  getAllRoutes(): Observable<SupplyChainRoute[]> {
    return this.routes$;
  }

  getRouteById(id: number): Observable<SupplyChainRoute | undefined> {
    return this.routes$.pipe(
      map(routes => routes.find(route => route.id === id))
    );
  }

  saveRoute(route: RouteSegment[]) {
    // Format the data, explicitly omitting the id
    const formattedRoute = {
      routeSegments: route.map(segment => ({
        ...segment,
      }))
    };
  
    console.log('supply chain service:saveRoute:formatted data', formattedRoute);

    const routesObservable = this.databaseService.addData('routes', formattedRoute).pipe(
      tap(id => {
        const newRoute: SupplyChainRoute = {
          id,
          routeSegments: formattedRoute.routeSegments
        };
  
        console.info('supply-chain-service:saveRoute:newRoute:', newRoute);
        const currentRoutes = this.routesSubject.value;
        this.routesSubject.next([...currentRoutes, newRoute]);
      }),
      map(id => {
        return {
          id,
          routeSegments: formattedRoute.routeSegments
        };
      })
    );

    // creates analytics record when route is saved
    // Format the data, explicitly omitting the id
    const {id, ...newSupplyChainAnalyticsData} = this.routeService.calculateSupplyChainAnalytics(route);

    const analyticsObservable = this.databaseService.addData('sc-analytics', newSupplyChainAnalyticsData).pipe(
      tap(id => {
        const newAnalytics: SupplyChainAnalytics = { ...newSupplyChainAnalyticsData, id };
  
        console.info('supply-chain-service:saveRoute:newAnalytics:', newAnalytics);
        const currentAnalytics = this.analyticsSubject.value;
        this.analyticsSubject.next([...currentAnalytics, newAnalytics]);
      }),
      map(id => {
        return { ...newSupplyChainAnalyticsData, id };
      })
    );

    // return routesObservable;
    return forkJoin({
      routes: routesObservable,
      analytics: analyticsObservable,
    }).pipe(
        tap(({ routes, analytics }) => {
            console.log('Both records saved successfully', { routes, analytics });
        }),
        catchError(error => {
            console.error('Error saving records to IndexedDB:', error);
            throw error;
        })
    );
  }

  getRoutes(): Observable<SupplyChainRoute[]> {
    return this.routes$;
  }

  setRoutes(routes: SupplyChainRoute[]): void {
    this.routesSubject.next(routes);
  }

  getSegmentAnalytics(): Observable<SegmentAnalytics[]> {
    return this.databaseService.getAllRecords('segment-analytics')
  }

  getSupplyChainAnalyticsById(id: number): Observable<SupplyChainAnalytics | undefined> {
    return this.analytics$.pipe(
      map(analytics => analytics.find(_a => _a.id === id))
    );
  }

  getAnalytics(): Observable<SupplyChainAnalytics[]> {
    return this.analytics$;
  }

  setAnalytics(supplyChainAnalytics: SupplyChainAnalytics[]): void {
    this.analyticsSubject.next(supplyChainAnalytics)
  } 

  // Analyze routes for potential optimizations
  identifyOptimizationOpportunities(route: SupplyChainRoute) {
    const sortedRoutes = route.routeSegments
      .sort((segA, segB) => segB.emissionPerKm - segA.emissionPerKm)
      .slice(0, Math.ceil(route.routeSegments.length * 0.1));
      return {...route, routeSegments: sortedRoutes }
  }

  deleteRoute(id: number): Observable<void> {
    return this.databaseService.deleteData('routes', id).pipe(
      tap(() => {
        const currentRoutes = this.routesSubject.value;
        this.routesSubject.next(
          currentRoutes.filter(route => route.id !== id)
        );
      })
    );
  }
  
  deleteAnalytics(id: number): Observable<void> {
    return this.databaseService.deleteData('sc-analytics', id).pipe(
      tap(() => {
        const currentAnalytics = this.analyticsSubject.value;
        this.analyticsSubject.next(
          currentAnalytics.filter(a => a.id !== id)
        );
      })
    );
  }

  // Optional: method to update a route
  // updateRoute(id: number, updates: Partial<Route>): Observable<Route> {
  //   return this.getRouteById(id).pipe(
  //     switchMap(existingRoute => {
  //       if (!existingRoute) {
  //         throw new Error(`Route with id ${id} not found`);
  //       }
  //       const updatedRoute = { ...existingRoute, ...updates };
  //       return this.databaseService.deleteData('routes', id).pipe(
  //         switchMap(() => this.databaseService.addData('routes', updatedRoute)),
  //         tap(() => {
  //           const currentRoutes = this.routesSubject.value;
  //           this.routesSubject.next(
  //             currentRoutes.map(route => 
  //               route.id === id ? updatedRoute : route
  //             )
  //           );
  //         }),
  //         map(() => updatedRoute)
  //       );
  //     })
  //   );
  // }
}