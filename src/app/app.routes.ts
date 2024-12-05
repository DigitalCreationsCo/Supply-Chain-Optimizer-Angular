import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', 
        loadComponent: () => import('./dashboard/dashboard.component').then(m=>m.DashboardComponent)},
        { path: 'input', 
        loadComponent: () => import('./input-form/input-form.component').then(m=>m.InputFormComponent)},
        { path: 'results', 
        loadComponent: () => import('./results-visualization/results-visualization.component').then(m=>m.ResultsVisualizationComponent)},
];
