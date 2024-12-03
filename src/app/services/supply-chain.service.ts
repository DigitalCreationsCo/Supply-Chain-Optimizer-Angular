import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SupplyChainRoute } from '../models/route.model';
import { DatabaseService } from './database.service';
import { SegmentAnalyticsData } from '../models/analytics.model';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {
  constructor(private databaseService: DatabaseService) {
  }

  saveRoute(route: SupplyChainRoute): Observable<number> {
    return this.databaseService.addData('routes', route)
  }

  getRoutes(): Observable<SupplyChainRoute[]> {
    return this.databaseService.getAllRecords('routes')
  }

  getRouteAnalytics(): Observable<SegmentAnalyticsData[]> {
    return this.databaseService.getAllRecords('analytics')
  }

  identifyOptimizationOpportunities(routes: SupplyChainRoute) {
    // Analyze routes for potential optimizations
    return routes
      .sort((segA, segB) => segB.emission - segA.emission)
      .slice(0, Math.ceil(routes.length * 0.1));
  }
}