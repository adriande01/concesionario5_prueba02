import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VehiculoFormService, VehiculoFormGroup } from './vehiculo-form.service';
import { IVehiculo } from '../vehiculo.model';
import { VehiculoService } from '../service/vehiculo.service';
import { Combustible } from 'app/entities/enumerations/combustible.model';

@Component({
  selector: 'jhi-vehiculo-update',
  templateUrl: './vehiculo-update.component.html',
})
export class VehiculoUpdateComponent implements OnInit {
  isSaving = false;
  vehiculo: IVehiculo | null = null;
  combustibleValues = Object.keys(Combustible);

  editForm: VehiculoFormGroup = this.vehiculoFormService.createVehiculoFormGroup();

  constructor(
    protected vehiculoService: VehiculoService,
    protected vehiculoFormService: VehiculoFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vehiculo }) => {
      this.vehiculo = vehiculo;
      if (vehiculo) {
        this.updateForm(vehiculo);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vehiculo = this.vehiculoFormService.getVehiculo(this.editForm);
    if (vehiculo.id !== null) {
      this.subscribeToSaveResponse(this.vehiculoService.update(vehiculo));
    } else {
      this.subscribeToSaveResponse(this.vehiculoService.create(vehiculo));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVehiculo>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(vehiculo: IVehiculo): void {
    this.vehiculo = vehiculo;
    this.vehiculoFormService.resetForm(this.editForm, vehiculo);
  }
}
