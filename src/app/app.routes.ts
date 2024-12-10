import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', 
        loadComponent: () => import('./components/dashboard/dashboard.component').then(m=>m.DashboardComponent)},
        { path: 'analytics/:id', 
        loadComponent: () => import('./components/analytics/analytics.component').then(m=>m.AnalyticsComponent)},
        { path: 'results', 
        loadComponent: () => import('./components/results-visualization/results-visualization.component').then(m=>m.ResultsVisualizationComponent)},
];
