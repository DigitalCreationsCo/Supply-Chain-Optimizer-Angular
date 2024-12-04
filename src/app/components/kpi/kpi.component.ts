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
    <div *ngIf="!isLoading && segments.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <mat-card>
        <mat-card-content>
          <div class="text-2xl font-bold">{{ totalEmissions | number:'1.0-2' }}</div>
          <p>Total Emissions (CO2e??) (per km??)</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="text-2xl font-bold">{{ avgEmissions | number:'1.0-2' }}</div>
          <p>Avg Emissions (per Route? per Segment?)</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="text-2xl font-bold">{{ segments.length }}</div>
          <p>Total Segments</p>
        </mat-card-content>
      </mat-card>
    </div>
    <div *ngIf="!isLoading && segments.length === 0" class="text-center py-4">
      <p>No data available to display.</p>
    </div>
  `
})
export class KpiCardsComponent implements AfterViewInit, OnChanges {
  @Input() segments: RouteSegment[] = [];
  isLoading: boolean = true;

  constructor(private routeService: RouteService) {}

  ngAfterViewInit(): void {
    if (this.segments) {
      this.isLoading = false
    }
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['segments'] && this.segments) {
      this.isLoading = false;
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
