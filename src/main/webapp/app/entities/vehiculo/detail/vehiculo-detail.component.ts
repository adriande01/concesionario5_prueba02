import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVehiculo } from '../vehiculo.model';

@Component({
  selector: 'jhi-vehiculo-detail',
  templateUrl: './vehiculo-detail.component.html',
})
export class VehiculoDetailComponent implements OnInit {
  vehiculo: IVehiculo | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehiculo }) => {
      this.vehiculo = vehiculo;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
