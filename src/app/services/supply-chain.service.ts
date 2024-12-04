import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, from, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { RouteSegment, SupplyChainRoute } from '../models/route.model';
import { DatabaseService } from './database.service';
import { SegmentAnalyticsData } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {
  private routesSubject = new BehaviorSubject<SupplyChainRoute[]>([]);
  public routes$ = this.routesSubject.asObservable();

  constructor(private databaseService: DatabaseService) {
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
      emission: Number(segment.emission) || 0,
      // distance: Number(segment.distance) || 0
    }))
  };
  
    console.log('supply chain service:saveRoute:formatted data', formattedRoute);
  
    return this.databaseService.addData('routes', formattedRoute).pipe(
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
        console.info('map, returnedId', id)
        return {
          id,
          routeSegments: formattedRoute.routeSegments
        };
      })
    );
  }

  getRoutes(): Observable<SupplyChainRoute[]> {
    return this.routes$;
  }

  setRoutes(routes: SupplyChainRoute[]): void {
    this.routesSubject.next(routes);
  }

  getRouteAnalytics(): Observable<SegmentAnalyticsData[]> {
    return this.databaseService.getAllRecords('analytics')
  }

  // Analyze routes for potential optimizations
  identifyOptimizationOpportunities(route: SupplyChainRoute) {
    const sortedRoutes = route.routeSegments
      .sort((segA, segB) => segB.emission - segA.emission)
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