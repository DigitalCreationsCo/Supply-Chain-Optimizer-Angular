import { AfterViewInit, Component, Input, PLATFORM_ID, Inject, OnChanges, SimpleChanges } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupplyChainRoute } from '../../models/route.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-map-view',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Geographic Distribution</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div id="map" style="height: 400px;"></div>
      </mat-card-content>
    </mat-card>
  `
})
export class MapViewComponent implements AfterViewInit, OnChanges {
  @Input() route: SupplyChainRoute = {id: 0, routeSegments: []}
  private map: any;
  private L: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  async initializeMap() {
    if (isPlatformBrowser(this.platformId)) {
      console.debug(`map-view-component:initializeMap:route${this.route}`)
      this.L = await import('leaflet');
      this.map = this.L.map('map').setView([51.505, -0.09], 2);
      this.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }).addTo(this.map);
    }
  }

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

  private plotRoutes() {
    if (!this.route?.routeSegments) {
      return;
    }
    console.debug(`map-view-component:plotRoutes:route`, this.route);
    this.route.routeSegments.forEach(segment => {
      if (!segment?.origin || !segment?.destination) {
        console.warn('Invalid segment data', segment);
        return;
      }
      
      this.addMarker(segment.origin.latitude, segment.origin.longitude, 'Origin');
      this.addMarker(segment.destination.latitude, segment.destination.longitude, 'Destination');
    });
  }

  private addMarker(latitude: number, longitude: number, title: string): void {
    if (this.map) {
      this.L.marker([latitude, longitude], { title }).addTo(this.map);
    }
  }
}