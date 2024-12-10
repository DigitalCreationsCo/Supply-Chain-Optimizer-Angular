import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SupplyChainAnalytics } from '../../models/analytics.model';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SupplyChainService } from '../../services/supply-chain.service';

@Component({
  selector: 'app-analytics',
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterModule],
  template: `
    <div *ngIf="isLoading" class="text-center py-4">
      <p>Loading data...</p>
    </div>
    <mat-card *ngIf="!isLoading && supplyChainAnalytics.segmentAnalytics.length > 0" class="analytics-page">
      <mat-card-content>
        <div style="display:flex;justify-content:space-between;">
          <h1>Supply Chain Route</h1>
          <a *ngIf="router.url === '/'" mat-raised-button color="accent" [routerLink]="['/analytics']">Expand</a>
        </div>

        <div class="line-item">
        <p>Origin</p>
        <div class="line"></div>
        <p>{{ firstOrigin }}</p>
        </div>

        <div class="line-item">
        <p>Destination</p>
        <div class="line"></div>
        <p>{{ lastDestination }}</p>
        </div>
         
        <div class="line-item">
        <p>Distance</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.distance | number:'1.0-2' }}
        </div>

        <div class="line-item">
        <p>Total Emission (CO2e)</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.emission | number:'1.0-2' }}
        </div>

        <div class="line-item">
        <p>Average Segment Emission</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.averageEmission | number:'1.0-2' }}
        </div>
       
        
        <div class="line-item">
        <p>Total Segments</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.segmentAnalytics.length }}
        </div>

        <div class="line-item">
        <p>Total Transport Cost</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.cost | number:'1.0-2' }}
        </div>

        <div *ngIf="!isLoading && supplyChainAnalytics.segmentAnalytics.length > 0" class="segment-card-container">
          <h2>Route Segments</h2>
          <div *ngFor="let segment of supplyChainAnalytics.segmentAnalytics" class="segment-card">
            <mat-card class="segment-details">
              <mat-card-header>
                <mat-card-title>Segment: {{ segment.origin.name }} → {{ segment.destination.name }}</mat-card-title>
                <mat-card-subtitle>Mode: {{ segment.mode }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <div class="segment-data">
                <p><strong>Distance:</strong> {{ segment.distance | number: '1.0-2' }} km</p>
                <p><strong>Emission Per Km:</strong> {{ segment.emissionPerKm | number: '1.0-2' }} CO2e</p>
                <p><strong>Emission:</strong> {{ segment.emission | number: '1.0-2' }} CO2e</p>
                  <p><strong>Cost Per Km ($):</strong> {{ segment.costPerKm | currency }}</p>
                  <p><strong>Segment Cost:</strong> {{ segment.cost | currency }}</p>
                </div>
              </mat-card-content>
            </mat-card>
          </div>
        </div>

        <div *ngIf="!isLoading && supplyChainAnalytics.segmentAnalytics.length === 0">
          <p>No route segments available.</p>
        </div>
        <div *ngIf="isLoading">
          <p>Loading data...</p>
        </div>


         
      </mat-card-content>
    </mat-card>
    <div *ngIf="!isLoading && supplyChainAnalytics.segmentAnalytics.length === 0" class="text-center py-4">
      <p>No data available to display.</p>
    </div>
  `,
  styleUrl: './analytics.component.css'
})
export class AnalyticsComponent implements OnInit, OnChanges {
  @Input() supplyChainAnalytics:SupplyChainAnalytics = {
    id: 0,
    name: "",
    segmentAnalytics: [],
    averageEmission: 0,
    emission: 0,
    cost: 0,
    distance: 0,
    createdAt: null,
    timeSavings: 0,
  };
  isLoading: boolean = true;
  firstOrigin = '';
  lastDestination = '';
  analyticsId: number = 0;

  constructor(
    private routeService: RouteService,
    private route: ActivatedRoute,
    private supplyChainService: SupplyChainService,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.analyticsId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    if (this.analyticsId) {
      this.loadData();
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplyChainAnalytics'] && this.supplyChainAnalytics.segmentAnalytics.length > 0) {
      this.firstOrigin = this.supplyChainAnalytics.segmentAnalytics[0].origin.name;
      this.lastDestination = this.supplyChainAnalytics.segmentAnalytics[this.supplyChainAnalytics.segmentAnalytics.length - 1].destination.name;
      this.isLoading = false;
 
      this.updateView();
    }
  }

  private loadData(): void {
    // Fetch or update data when component loads or route changes
    const analytics = this.supplyChainService.getSupplyChainAnalyticsById(this.analyticsId).subscribe({
      next: (analytics) => {
        if (analytics) {
          this.supplyChainAnalytics = analytics; // Assign the fetched data
          this.firstOrigin = analytics.segmentAnalytics[0]?.origin?.name || '';
          this.lastDestination = analytics.segmentAnalytics[analytics.segmentAnalytics.length - 1]?.destination?.name || '';
          this.isLoading = false;
        } else {
          console.warn('No analytics data found for ID:', this.analyticsId);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching analytics:', err);
      }
    });
  }

  private updateView(): void {
    const analytics = this.supplyChainAnalytics;
    if (analytics.segmentAnalytics.length > 0) {
      this.firstOrigin = analytics.segmentAnalytics[0]?.origin?.name || '';
      this.lastDestination =
        analytics.segmentAnalytics[analytics.segmentAnalytics.length - 1]?.destination?.name || '';
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }
}
