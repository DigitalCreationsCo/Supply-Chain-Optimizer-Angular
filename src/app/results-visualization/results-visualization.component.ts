import { CommonModule } from '@angular/common'; 
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SupplyChainRoute } from '../models/route.model'
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-results-visualization',
  imports: [
    MatButtonToggleModule, 
    MatCardModule,
    MatButtonModule,
    CommonModule, 
    BaseChartDirective, 
    RouterModule
  ],
  templateUrl: './results-visualization.component.html',
  styleUrl: './results-visualization.component.css'
})
export class ResultsVisualizationComponent implements AfterViewInit, OnChanges{
  @Input() route: SupplyChainRoute = {id: 0, routeSegments: []}
  isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object, 
    public router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  timeFrame: 'month' | 'quarter' | 'year' = 'month';
  
  public chartData: ChartData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [{
      data: [10, 20, 30, 40],
      label: 'Supply Chain Emission Record',
      fill: false,
      borderColor: 'blue',
      tension: 0.1
    }]
  };

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true, // Show the legend
        position: 'top' // Position of the legend (top, left, bottom, right)
      }
    },
  };

  public chartType: ChartType = 'line';

  ngAfterViewInit() {
    if (this.isBrowser) {
      // Initialize your chart here
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    
  }
}
