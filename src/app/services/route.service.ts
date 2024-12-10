// services/route.service.ts
import { Injectable } from '@angular/core';
import { RouteSegment, SupplyChainRoute } from '../models/route.model';
import { SegmentAnalytics, SupplyChainAnalytics } from '../models/analytics.model';

@Injectable({
  providedIn: 'root',
})
export class RouteService {
  constructor() {}

  // Haversine Formula for distance calculation (in km)
  private degreesToRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  }

  private calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
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

  calculateSegmentDistance = (segment:RouteSegment) => this.calculateDistance(segment.origin.latitude, segment.origin.longitude, segment.destination.latitude, segment.destination.longitude)
  calculateSegmentCost = (segment:RouteSegment) => this.calculateSegmentDistance(segment) * segment.costPerKm
  calculateSegmentEmission = (segment:RouteSegment) => this.calculateSegmentDistance(segment) * segment.emissionPerKm
  calculateTotalEmission = (segments: RouteSegment[]): number => {
    let segmentEmissionList = segments.map(this.calculateSegmentEmission)
    return segmentEmissionList.reduce((sum, currentValue) => {
        return sum += currentValue;
    }, 0);
  }

  calculateRouteAverageEmission = (emission: number, length: number): number => emission / length

  calculateSegmentAnalytics = (segment: RouteSegment): RouteSegment&SegmentAnalytics => {
    const distance = this.calculateDistance(segment.origin.latitude, segment.origin.longitude, segment.destination.latitude, segment.destination.longitude);
    const emission = segment.emissionPerKm;
    const cost = this.calculateSegmentCost(segment)
    return {
      ...segment,
      emission,
      distance,
      cost,
      mode: 'Truck', // This can be dynamic based on route/segment type
    };
  }

  calculateTotalCostAndDistance = (segments: RouteSegment[]): {cost:number, distance:number} => {
    return segments.map(segment => {
      const distance = this.calculateSegmentDistance(segment)
      return { distance, cost: this.calculateSegmentCost(segment) }
    }).reduce((prev, currentValue) => {
        return { 
          distance: prev.distance += currentValue.distance,
          cost: prev.cost += currentValue.cost
         };
    }, {cost: 0, distance: 0});
  }

  calculateSupplyChainAnalytics = (segments: RouteSegment[]):SupplyChainAnalytics => {
    if (segments.length > 0) {
      const segmentAnalytics = segments.map(this.calculateSegmentAnalytics)
      const emission = this.calculateTotalEmission(segments)
      const {cost, distance }= this.calculateTotalCostAndDistance(segments)
      return {
        id: 0,
        name: '',
        segmentAnalytics,
        emission,
        averageEmission: this.calculateRouteAverageEmission(emission,segments.length),
        cost,
        distance,
        createdAt: new Date(),
        timeSavings: 0
      }
    } else return {} as SupplyChainAnalytics
  }
}
