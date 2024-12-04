import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { InputFormComponent } from '../input-form/input-form.component';
import { ResultsVisualizationComponent } from '../results-visualization/results-visualization.component';
import { KpiCardsComponent } from '../components/kpi/kpi.component';
import { SupplyChainRoute } from '../models/route.model';
import { SupplyChainService } from '../services/supply-chain.service';
import { HotspotsTableComponent } from '../components/hotspots-table/hotspots-table.component';
import { MapViewComponent } from '../components/map-view/map-view.component';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    InputFormComponent,
    KpiCardsComponent,
    HotspotsTableComponent,
    ResultsVisualizationComponent,
    MapViewComponent,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnChanges, OnDestroy {
  private destroy$ = new Subject<void>();
  routes: SupplyChainRoute[] = []
  isLoading = true;  // Add this line

  constructor(private supplyChainService: SupplyChainService) {}

  ngOnInit(): void {
    this.supplyChainService.routes$
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (routes) => {
          this.routes = routes;
          this.isLoading = false;  // Set loading to false when data arrives
        },
        error: (error) => {
          console.error('Error fetching routes:', error);
          this.isLoading = false;  // Also set loading to false on error
        }
      });

    }
    
  ngOnChanges(changes: SimpleChanges): void {
    console.info('dashboard:changes:routes,',changes['routes'])
    console.info('dashboard:routes,',this.routes)
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
