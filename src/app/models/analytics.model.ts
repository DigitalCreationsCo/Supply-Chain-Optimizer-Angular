import { RouteSegment } from "./route.model";

export interface SegmentAnalytics {
    distance: number;
    emission: number;
    cost: number;
    mode: string;
}

export interface SupplyChainAnalytics {
    id: number;
    name: string;
    segmentAnalytics: (RouteSegment & SegmentAnalytics)[];
    averageEmission: number;
    emission: number;
    cost: number;
    distance: number;
    createdAt: Date | null;
    timeSavings: number;
}