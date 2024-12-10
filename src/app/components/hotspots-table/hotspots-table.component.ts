// src/app/components/hotspots-table/hotspots-table.component.ts
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { RouteService } from '../../services/route.service';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { SegmentAnalytics, SupplyChainAnalytics } from '../../models/analytics.model';


interface HotspotRoute extends SegmentAnalytics {
  percentileRank: number;
  emissionShare: number;
}

@Component({
  selector: 'app-hotspots-table',
  standalone: true,
  imports: [MatPaginatorModule, MatTableModule, MatSortModule, MatFormFieldModule, MatInputModule, MatCardModule, CommonModule],
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Emission Hotspots Analysis</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div class="mb-4">
          <mat-form-field>
            <mat-label>Filter Routes</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Ex. Origin or Destination">
          </mat-form-field>
        </div>

        <table mat-table [dataSource]="dataSource" matSort class="w-full">
          <ng-container matColumnDef="origin">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Origin</th>
            <td mat-cell *matCellDef="let route">{{route.origin.name}}</td>
          </ng-container>

          <ng-container matColumnDef="destination">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Destination</th>
            <td mat-cell *matCellDef="let route">{{route.destination.name}}</td>
          </ng-container>

          <ng-container matColumnDef="emission">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Emissions (CO2e)</th>
            <td mat-cell *matCellDef="let route">{{route.emission | number:'1.2-2'}}</td>
          </ng-container>

          <ng-container matColumnDef="percentileRank">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>Percentile</th>
            <td mat-cell *matCellDef="let route">
              <div class="flex items-center">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div class="bg-red-600 h-2.5 rounded-full" 
                       [style.width.%]="route.percentileRank">
                  </div>
                </div>
                <span class="ml-2">{{route.percentileRank}}%</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="emissionShare">
            <th mat-header-cell *matHeaderCellDef mat-sort-header>% of Total</th>
            <td mat-cell *matCellDef="let route">{{route.emissionShare | percent:'1.1-1'}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              [class.bg-red-50]="row.percentileRank > 90"></tr>
        </table>

        <mat-paginator [pageSize]="10" 
                      [pageSizeOptions]="[5, 10, 20]"
                      showFirstLastButtons>
        </mat-paginator>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .mat-column-percentileRank { min-width: 150px; }
  `]
})
export class HotspotsTableComponent implements OnChanges {
  @Input() route: SupplyChainAnalytics | null = null;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns = ['origin', 'destination', 'emission', 'percentileRank', 'emissionShare'];
  dataSource: MatTableDataSource<HotspotRoute>;

  constructor( private routeService: RouteService) {
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges(changes:SimpleChanges) {
    console.info('hotspots:onChanges:this.route', this.route);
    if (changes['route'] && this.route && this.route['segmentAnalytics'].length > 0) {
      
      const enrichedRoute: HotspotRoute[] = this.route['segmentAnalytics']
        .map(segment => ({
          ...segment,
          percentileRank: this.calculatePercentileRank(segment.emission),
          emissionShare: segment.emission / this.route!.emission
        }))
        .sort((a, b) => b.emission - a.emission);

      this.dataSource.data = enrichedRoute;
    }
  }

  private calculatePercentileRank(emission: number): number {
    const sortedEmissions = [...this.route!['segmentAnalytics']]
      .map(r => r.emission)
      .sort((a, b) => a - b);
    
    const index = sortedEmissions.findIndex(e => e >= emission);
    return Number(((index / sortedEmissions.length) * 100).toFixed(1));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}