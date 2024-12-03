import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InputFormComponent } from './input-form/input-form.component';
import { ResultsVisualizationComponent } from './results-visualization/results-visualization.component';

export const routes: Routes = [
    { path: '', component: DashboardComponent },  // Default route
    { path: 'input', component: InputFormComponent },
    { path: 'results', component: ResultsVisualizationComponent }
];
