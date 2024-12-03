// services/route.service.ts
import { Injectable } from '@angular/core';
import { RouteSegment, SupplyChainRoute } from '../models/route.model';
import { SegmentAnalyticsData } from '../models/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor() {}

  // Haversine Formula for distance calculation (in km)
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth radius in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLon = this.degreesToRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in km
  }

  // Calculate total emissions for a route
  calculateTotalEmissions(route: SupplyChainRoute): number {
    let totalEmissionsList = route.map((segment) => this.calculateDistance(segment.origin.latitude, segment.origin.longitude, segment.destination.latitude, segment.destination.longitude) * segment.emission);
    
    // sum segment emissions
    const totalEmissions = totalEmissionsList.reduce((sum, currentValue) => {
        return sum += currentValue;
    }, 0);

    return totalEmissions;
  }

  // Calculate route analytics
  calculateAnalytics(segment: RouteSegment, costPerKm: number): SegmentAnalyticsData {
    const distance = this.calculateDistance(segment.origin.latitude, segment.origin.longitude, segment.destination.latitude, segment.destination.longitude);
    const emissions = segment.emission;
    const cost = distance * costPerKm; // Example cost per km (could be dynamic)

    return {
      emissions,
      distance,
      cost,
      mode: 'Truck', // This can be dynamic based on route/segment type
    };
  }
}
