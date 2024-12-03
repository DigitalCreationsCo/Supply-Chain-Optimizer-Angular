import { Component, OnInit } from '@angular/core';
import { InputFormComponent } from '../input-form/input-form.component';
import { ResultsVisualizationComponent } from '../results-visualization/results-visualization.component';
import { KpiCardsComponent } from '../components/kpi/kpi.component';
import { RouteSegment, SupplyChainRoute } from '../models/route.model';
import { SupplyChainService } from '../services/supply-chain.service';
import { HotspotsTableComponent } from '../components/hotspots-table/hotspots-table.component';
import { MapViewComponent } from '../components/map-view/map-view.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    InputFormComponent,
    KpiCardsComponent,
    HotspotsTableComponent,
    ResultsVisualizationComponent,
    MapViewComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  routes: SupplyChainRoute[] = []

  constructor (private supplyChainService: SupplyChainService) {}

  ngOnInit() {
    this.supplyChainService.getRoutes().subscribe(
      routes => this.routes = routes
    );
  }
}
