import { RouteSegment } from "./route.model";

export interface SegmentAnalyticsData {
    emissions: number;
    distance: number;
    cost: number;
    mode: string;
}

export interface Scenario {
    id: string;
    name: string;
    segment: RouteSegment;
    averageEmissions: number;
    cost: number;
    distance?: number;
    timestamp: Date;
    timeSaved: number;
}