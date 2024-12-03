import { Component, Input } from '@angular/core';
import { RouteSegment } from '../../models/route.model';
import { RouteService } from '../../services/route.service';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-kpi-cards',
  imports: [MatCardModule, CommonModule],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <mat-card>
        <mat-card-content>
          <div class="text-2xl font-bold">{{totalEmissions | number:'1.0-2'}}</div>
          <p>Total Emissions (CO2e??) (per km??)</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="text-2xl font-bold">{{avgEmissions | number:'1.0-2'}}</div>
          <p>Avg Emissions (per Route? per Segment?)</p>
        </mat-card-content>
      </mat-card>
      <mat-card>
        <mat-card-content>
          <div class="text-2xl font-bold">{{segments.length}}</div>
          <p>Total Segments</p>
        </mat-card-content>
      </mat-card>
    </div>
  `
})
export class KpiCardsComponent {
  @Input() segments: RouteSegment[] = [];

  private routeService: RouteService;
  constructor() {
    this.routeService = new RouteService();
  }
  get totalEmissions(): number {
    return this.routeService.calculateTotalEmissions(this.segments);
  }

  get avgEmissions(): number {
    return this.totalEmissions / this.segments.length;
  }
}