import { AfterViewInit, Component, Input, PLATFORM_ID, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupplyChainRoute } from '../../models/route.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card class="map-card">
      <mat-card-header>
        <mat-card-title>Geographic Distribution</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="map-container">
          <div id="map"></div>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .map-card {
      margin: 1rem;
      height: auto;
    }

    .map-container {
      position: relative;
      height: 400px;
      width: 100%;
      margin: 1rem 0;
      overflow: clip;
    }

    #map {
      position: relative;
      height: 100%;
      width: 100%;
      border: 1px solid #ddd;
      border-radius: 4px;
      z-index: 1;  /* Ensure map stays within its container */
    }

    /* Fix for mat-card-content padding */
    ::ng-deep .mat-mdc-card-content {
      padding: 0 1rem !important;
    }
  `]
})

export class MapViewComponent implements AfterViewInit, OnChanges {
  @Input() route: SupplyChainRoute = {id: 0, routeSegments: []}
  private map: any;
  private L: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async ngAfterViewInit() {
    await this.initializeMap();
    if (this.map) {
      this.plotRoutes();
    }
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (!this.map) {
      await this.initializeMap();
    }
    if (changes['route'] && this.route) {
      this.plotRoutes();
    }
  }

  async initializeMap() {
    if (isPlatformBrowser(this.platformId)) {
      console.debug(`map-view-component:initializeMap:route`, this.route);
      this.L = await import('leaflet');
      
      // Initialize map with better default options
      this.map = this.L.map('map', {
        center: [20, 0], // More centered global view
        zoom: 2,
        minZoom: 2,
        maxZoom: 18,
        scrollWheelZoom: false,
        zoomControl: true
      });
  
      // Add tile layer with better options
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
        tileSize: 512,
        zoomOffset: -1
      }).addTo(this.map);
  
      // Add zoom control to top-right
      this.L.control.zoom({
        position: 'topright'
      }).addTo(this.map);
  
      // Fit bounds after plotting routes
      this.map.on('load', () => {
        this.fitMapToMarkers();
      });
    }
  }
  
  // Add this new method to fit the map to markers
  private fitMapToMarkers() {
    if (this.route?.routeSegments?.length > 0) {
      const bounds = new this.L.LatLngBounds();
      
      this.route.routeSegments.forEach(segment => {
        if (segment?.origin && segment?.destination) {
          bounds.extend([segment.origin.latitude, segment.origin.longitude]);
          bounds.extend([segment.destination.latitude, segment.destination.longitude]);
        }
      });
  
      if (bounds.isValid()) {
        this.map.fitBounds(bounds, {
          padding: [50, 50],
          maxZoom: 12
        });
      }
    }
  }
  
  // Update plotRoutes to include path lines between points
  private plotRoutes() {
    if (!this.route?.routeSegments) {
      return;
    }
  
    // Clear existing markers and paths
    this.map.eachLayer((layer: any) => {
      if (layer instanceof this.L.Marker || layer instanceof this.L.Polyline) {
        this.map.removeLayer(layer);
      }
    });
  
    this.route.routeSegments.forEach(segment => {
      if (!segment?.origin || !segment?.destination) {
        console.warn('Invalid segment data', segment);
        return;
      }
      
      // Add markers
      this.addMarker(segment.origin.latitude, segment.origin.longitude, 'Origin');
      this.addMarker(segment.destination.latitude, segment.destination.longitude, 'Destination');
      
      // Draw path line between points
      const path = [
        [segment.origin.latitude, segment.origin.longitude],
        [segment.destination.latitude, segment.destination.longitude]
      ];
      
      this.L.polyline(path, {
        color: '#2196F3',
        weight: 3,
        opacity: 0.7
      }).addTo(this.map);
    });
  
    // Fit map to show all markers
    this.fitMapToMarkers();
  }

  private addMarker(latitude: number, longitude: number, title: string): void {
    if (this.map) {
      this.L.marker([latitude, longitude], { title }).addTo(this.map);
    }
  }
}