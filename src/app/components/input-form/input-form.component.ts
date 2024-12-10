import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Location, RouteSegment } from '../../models/route.model';
import { SupplyChainService } from '../../services/supply-chain.service';

@Component({
  selector: 'app-input-form',
  imports: [
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
  ],
  standalone: true,
  templateUrl: './input-form.component.html',
  styleUrl: './input-form.component.css'
})


export class InputFormComponent {
  constructor(private supplyChainService:SupplyChainService) {}

  supplyChainForm = new FormGroup({
    origin: new FormGroup({
      name: new FormControl('', Validators.required),
      latitude: new FormControl(0, Validators.required),
      longitude: new FormControl(0, Validators.required),
    }),
    destination: new FormGroup({
      name: new FormControl('', Validators.required),
      latitude: new FormControl(0, Validators.required),
      longitude: new FormControl(0, Validators.required),
  }),
    costPerKm: new FormControl(0, [Validators.required, Validators.min(0.01)]),
    emissionPerKm: new FormControl(0, [Validators.required, Validators.min(0.01)])
  });

  public originAutoCompleteList: Location[] = [];
  public destinationAutoCompleteList: Location[] = [];

  supplyChainRouteList: RouteSegment[] = []

  async autoCompleteOrigin() {
    const query = this.supplyChainForm.get('origin')?.get('name')?.value;
    const response = await fetch(`/api/loc/autocomplete?q=${query}`);
    const data = await response.json();
    this.originAutoCompleteList = data;
  }

  async autoCompleteDestination() {
    const query = this.supplyChainForm.get('destination')?.get('name')?.value;
    const response = await fetch(`/api/loc/autocomplete?q=${query}`);
    const data = await response.json();
    this.destinationAutoCompleteList = data;
  }

  selectOrigin() {
    const selectedOption = this.supplyChainForm.get('origin')?.get('name')?.value;

    const selectedOrigin = this.originAutoCompleteList.find(option => option.name === selectedOption);

    if (selectedOrigin) {
      this.supplyChainForm.get('origin')?.setValue(selectedOrigin);
    }
  }
  
  selectDestination() {
    const selectedOption = this.supplyChainForm.get('destination')?.get('name')?.value;

    const selectedDestination = this.destinationAutoCompleteList.find(option => option.name === selectedOption);

    if (selectedDestination) {
      this.supplyChainForm.get('destination')?.setValue(selectedDestination);
    }
  }

  onSubmit() {
    if (this.supplyChainForm.valid) {
      const newSegment = this.supplyChainForm.value as RouteSegment;
  
      this.supplyChainRouteList.push(newSegment);
  
      this.supplyChainForm.markAsUntouched();
      this.supplyChainForm.reset();
    } else {
      this.supplyChainForm.markAllAsTouched();
    }
  }

  saveRoutes() {
    this.supplyChainService.saveRoute(this.supplyChainRouteList).subscribe(savedRoute =>
      console.debug('saved route', savedRoute)
      );
    this.supplyChainRouteList = []
  }
}
