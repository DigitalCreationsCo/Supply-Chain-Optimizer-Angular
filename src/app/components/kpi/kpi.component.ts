import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RouteSegment } from '../../models/route.model';
import { RouteService } from '../../services/route.service';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-cards',
  imports: [MatCardModule, CommonModule],
  template: `
    <div *ngIf="isLoading" class="text-center py-4">
      <p>Loading data...</p>
    </div>
    <mat-card *ngIf="!isLoading && segments.length > 0" class="kpi-card">
      <mat-card-content>
        <p>{{ firstOrigin }} --- {{ lastDestination }}</p>

        <div class="line-item">
        <p>Total Emissions (CO2e)</p>
        <div class="line"></div>
        {{ totalEmissions | number:'1.0-2' }}
        </div>

        <div class="line-item">
        <p>Avg Emissions (WIP - per Segment)</p>
        <div class="line"></div>
        {{ avgEmissions | number:'1.0-2' }}
        </div>
        
        <div class="line-item">
        <p>Avg Emissions (WIP - per Route)</p>
        <div class="line"></div>
        {{ avgEmissions | number:'1.0-2' }}
        </div>

        <div class="line-item">
        <p>Total Segments</p>
        <div class="line"></div>
        {{ segments.length }}
        </div>

         
      </mat-card-content>
    </mat-card>
    <div *ngIf="!isLoading && segments.length === 0" class="text-center py-4">
      <p>No data available to display.</p>
    </div>
  `,
  styleUrl: './kpi.component.css'
})
export class KpiCardsComponent implements AfterViewInit, OnChanges {
  @Input() segments: RouteSegment[] = [];
  isLoading: boolean = true;
  firstOrigin = ''
  lastDestination = ''

  constructor(private routeService: RouteService) {}

  ngAfterViewInit(): void {
    if (this.segments) {
      this.isLoading = false
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['segments'] && this.segments) {
      this.isLoading = false;
      this.firstOrigin = this.segments[0].origin.name;
      this.lastDestination = this.segments[this.segments.length - 1].destination.name;
    }
  }

  get totalEmissions(): number {
    return this.segments.length > 0
      ? this.routeService.calculateTotalEmissions(this.segments)
      : 0; // Return 0 if no segments are provided
  }

  get avgEmissions(): number {
    return this.segments.length > 0
      ? this.totalEmissions / this.segments.length
      : 0; // Return 0 to avoid division by zero
  }
}
