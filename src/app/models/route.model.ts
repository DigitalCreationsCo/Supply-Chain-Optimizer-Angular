export type Location = {
    name: string;
    latitude: number;
    longitude: number;
}

export type RouteSegment = {
    origin: Location,
    destination: Location,
    emissionPerKm: number;
    costPerKm: number;
};

export type SupplyChainRoute = {
    id: number;
    routeSegments: RouteSegment[]
}