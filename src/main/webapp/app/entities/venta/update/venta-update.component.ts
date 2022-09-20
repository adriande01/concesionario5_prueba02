import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VentaFormService, VentaFormGroup } from './venta-form.service';
import { IVenta } from '../venta.model';
import { VentaService } from '../service/venta.service';
import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';
import { VehiculoService } from 'app/entities/vehiculo/service/vehiculo.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';
import { VendedorService } from 'app/entities/vendedor/service/vendedor.service';

@Component({
  selector: 'jhi-venta-update',
  templateUrl: './venta-update.component.html',
})
export class VentaUpdateComponent implements OnInit {
  isSaving = false;
  venta: IVenta | null = null;

  vehiculosCollection: IVehiculo[] = [];
  clientesSharedCollection: ICliente[] = [];
  vendedorsSharedCollection: IVendedor[] = [];

  editForm: VentaFormGroup = this.ventaFormService.createVentaFormGroup();

  constructor(
    protected ventaService: VentaService,
    protected ventaFormService: VentaFormService,
    protected vehiculoService: VehiculoService,
    protected clienteService: ClienteService,
    protected vendedorService: VendedorService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareVehiculo = (o1: IVehiculo | null, o2: IVehiculo | null): boolean => this.vehiculoService.compareVehiculo(o1, o2);

  compareCliente = (o1: ICliente | null, o2: ICliente | null): boolean => this.clienteService.compareCliente(o1, o2);

  compareVendedor = (o1: IVendedor | null, o2: IVendedor | null): boolean => this.vendedorService.compareVendedor(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venta }) => {
      this.venta = venta;
      if (venta) {
        this.updateForm(venta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const venta = this.ventaFormService.getVenta(this.editForm);
    if (venta.id !== null) {
      this.subscribeToSaveResponse(this.ventaService.update(venta));
    } else {
      this.subscribeToSaveResponse(this.ventaService.create(venta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVenta>>): void {
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

  protected updateForm(venta: IVenta): void {
    this.venta = venta;
    this.ventaFormService.resetForm(this.editForm, venta);

    this.vehiculosCollection = this.vehiculoService.addVehiculoToCollectionIfMissing<IVehiculo>(this.vehiculosCollection, venta.vehiculo);
    this.clientesSharedCollection = this.clienteService.addClienteToCollectionIfMissing<ICliente>(
      this.clientesSharedCollection,
      venta.cliente
    );
    this.vendedorsSharedCollection = this.vendedorService.addVendedorToCollectionIfMissing<IVendedor>(
      this.vendedorsSharedCollection,
      venta.vendedor
    );
  }

  protected loadRelationshipsOptions(): void {
    this.vehiculoService
      .query({ filter: 'venta-is-null' })
      .pipe(map((res: HttpResponse<IVehiculo[]>) => res.body ?? []))
      .pipe(
        map((vehiculos: IVehiculo[]) => this.vehiculoService.addVehiculoToCollectionIfMissing<IVehiculo>(vehiculos, this.venta?.vehiculo))
      )
      .subscribe((vehiculos: IVehiculo[]) => (this.vehiculosCollection = vehiculos));

    this.clienteService
      .query()
      .pipe(map((res: HttpResponse<ICliente[]>) => res.body ?? []))
      .pipe(map((clientes: ICliente[]) => this.clienteService.addClienteToCollectionIfMissing<ICliente>(clientes, this.venta?.cliente)))
      .subscribe((clientes: ICliente[]) => (this.clientesSharedCollection = clientes));

    this.vendedorService
      .query()
      .pipe(map((res: HttpResponse<IVendedor[]>) => res.body ?? []))
      .pipe(
        map((vendedors: IVendedor[]) => this.vendedorService.addVendedorToCollectionIfMissing<IVendedor>(vendedors, this.venta?.vendedor))
      )
      .subscribe((vendedors: IVendedor[]) => (this.vendedorsSharedCollection = vendedors));
  }
}
