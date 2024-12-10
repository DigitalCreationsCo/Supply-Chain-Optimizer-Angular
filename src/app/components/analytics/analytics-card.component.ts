import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { RouteService } from '../../services/route.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { SupplyChainAnalytics } from '../../models/analytics.model';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-analytics-cards',
  imports: [MatCardModule, MatButtonModule, CommonModule, RouterModule],
  template: `
    <div *ngIf="isLoading" class="text-center py-4">
      <p>Loading data...</p>
    </div>
    <mat-card *ngIf="!isLoading && supplyChainAnalytics.segmentAnalytics.length > 0" class="analytics-card">
      <mat-card-content>
        <div style="display:flex;justify-content:end;">
          <a *ngIf="router.url === '/'" 
          mat-raised-button color="accent" 
          [routerLink]="['/analytics', supplyChainAnalytics.id]"
          >Expand</a>
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
        <p>Distance</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.distance | number:'1.0-2' }}
        </div>
        
        <div class="line-item">
        <p>Total Transport Cost</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.cost | number:'1.0-2' }}
        </div>

        <div class="line-item">
        <p>Total Segments</p>
        <div class="line"></div>
        {{ supplyChainAnalytics.segmentAnalytics.length }}
        </div>

         
      </mat-card-content>
    </mat-card>
    <div *ngIf="!isLoading && supplyChainAnalytics.segmentAnalytics.length === 0" class="text-center py-4">
      <p>No data available to display.</p>
    </div>
  `,
  styleUrl: './analytics.component.css'
})
export class AnalyticsCardComponent implements AfterViewInit, OnChanges {
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

  constructor(
    private routeService: RouteService,
    public router: Router
  ) {}

  ngAfterViewInit(): void {
    if (this.supplyChainAnalytics.segmentAnalytics.length > 0) {
      this.isLoading = false
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['supplyChainAnalytics'] && this.supplyChainAnalytics.segmentAnalytics.length > 0) {
      this.firstOrigin = this.supplyChainAnalytics.segmentAnalytics[0].origin.name;
      this.lastDestination = this.supplyChainAnalytics.segmentAnalytics[this.supplyChainAnalytics.segmentAnalytics.length - 1].destination.name;
      this.isLoading = false;

      console.info('supplychain analytics: ', this.supplyChainAnalytics)
    }
  }
}
