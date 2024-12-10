import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { SupplyChainRoute } from '../../models/route.model';
import { SupplyChainAnalytics } from '../../models/analytics.model';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
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
export class ResultsVisualizationComponent implements AfterViewInit, OnChanges {
  @Input() route: SupplyChainRoute = { id: 0, routeSegments: [] };
  @Input() analytics?: SupplyChainAnalytics;
  
  isBrowser: boolean;
  timeFrame: 'month' | 'quarter' | 'year' = 'month';
  selectedChartType: ChartType = 'line';
  
  chartTypes: { value: ChartType; label: string }[] = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'radar', label: 'Radar Chart' },
    { value: 'polarArea', label: 'Polar Area' },
    { value: 'doughnut', label: 'Doughnut Chart' }
  ];

  public chartData: ChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Emissions (kg CO2)',
        fill: false,
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        tension: 0.1
      },
      {
        data: [],
        label: 'Cost ($)',
        fill: false,
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.1
      },
      {
        data: [],
        label: 'Distance (km)',
        fill: false,
        borderColor: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.1
      }
    ]
  };

  private lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `${value}`
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)}`;
          }
        }
      }
    }
  };

  private radarChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      r: {
        beginAtZero: true
      }
    }
  };

  private polarAreaChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };

  private doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      }
    }
  };

  public chartOptions: ChartOptions = this.lineChartOptions;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.updateChartData();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.isBrowser && (changes['route'] || changes['analytics'])) {
      this.updateChartData();
    }
  }

  private updateChartData() {
    if (!this.analytics?.segmentAnalytics) return;

    const segments = this.analytics.segmentAnalytics;
    
    // Generate labels based on segment index
    this.chartData.labels = segments.map((_, index) => `Segment ${index + 1}`);

    // Update datasets with appropriate styling based on chart type
    const datasets = [
      {
        data: segments.map(segment => segment.emission),
        label: 'Emissions (kg CO2)',
        borderColor: '#2196F3',
        backgroundColor: 'rgba(33, 150, 243, 0.2)',
        tension: 0.1
      },
      {
        data: segments.map(segment => segment.cost),
        label: 'Cost ($)',
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.1
      },
      {
        data: segments.map(segment => segment.distance),
        label: 'Distance (km)',
        borderColor: '#FFC107',
        backgroundColor: 'rgba(255, 193, 7, 0.2)',
        tension: 0.1
      }
    ];

    // Adjust dataset properties based on chart type
    if (['polarArea', 'doughnut'].includes(this.selectedChartType)) {
      // For these chart types, we'll show total values instead of segment breakdown
      this.chartData.labels = ['Emissions', 'Cost', 'Distance'];
      this.chartData.datasets = [{
        data: [
          this.analytics.emission,
          this.analytics.cost,
          this.analytics.distance
        ],
        backgroundColor: [
          'rgba(33, 150, 243, 0.6)',
          'rgba(76, 175, 80, 0.6)',
          'rgba(255, 193, 7, 0.6)'
        ],
        borderColor: [
          '#2196F3',
          '#4CAF50',
          '#FFC107'
        ]
      }];
    } else {
      this.chartData.datasets = datasets;
    }

    // Force chart update
    this.chartData = { ...this.chartData };
  }

  onTimeFrameChange(timeFrame: 'month' | 'quarter' | 'year') {
    this.timeFrame = timeFrame;
    this.updateChartData();
  }

  onChartTypeChange(chartType: ChartType) {
    this.selectedChartType = chartType;
    
    // Update chart options based on chart type
    switch (chartType) {
      case 'radar':
        this.chartOptions = this.radarChartOptions;
        break;
      case 'polarArea':
        this.chartOptions = this.polarAreaChartOptions;
        break;
      case 'doughnut':
        this.chartOptions = this.doughnutChartOptions;
        break;
      default:
        this.chartOptions = this.lineChartOptions;
    }
    
    this.updateChartData();
  }
}