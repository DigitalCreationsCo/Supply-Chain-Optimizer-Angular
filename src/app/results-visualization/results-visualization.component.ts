import { CommonModule } from '@angular/common'; 
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SupplyChainRoute } from '../models/route.model'
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-results-visualization',
  imports: [MatButtonToggleModule, MatCardModule,CommonModule, BaseChartDirective],
  templateUrl: './results-visualization.component.html',
  styleUrl: './results-visualization.component.css'
})
export class ResultsVisualizationComponent implements OnChanges{
  @Input() route: SupplyChainRoute = [];
  timeFrame: 'month' | 'quarter' | 'year' = 'month';
  
  public chartData: ChartData = {
    labels: ['January', 'February', 'March', 'April'],
    datasets: [{
      data: [10, 20, 30, 40],
      label: 'Supply Chain Emissions',
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

  ngOnChanges(changes: SimpleChanges): void {
      this.updateChartData();
  }

  private updateChartData() {
    
  }
}
