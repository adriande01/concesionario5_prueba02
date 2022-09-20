import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { VendedorFormService, VendedorFormGroup } from './vendedor-form.service';
import { IVendedor } from '../vendedor.model';
import { VendedorService } from '../service/vendedor.service';

@Component({
  selector: 'jhi-vendedor-update',
  templateUrl: './vendedor-update.component.html',
})
export class VendedorUpdateComponent implements OnInit {
  isSaving = false;
  vendedor: IVendedor | null = null;

  editForm: VendedorFormGroup = this.vendedorFormService.createVendedorFormGroup();

  constructor(
    protected vendedorService: VendedorService,
    protected vendedorFormService: VendedorFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ vendedor }) => {
      this.vendedor = vendedor;
      if (vendedor) {
        this.updateForm(vendedor);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const vendedor = this.vendedorFormService.getVendedor(this.editForm);
    if (vendedor.id !== null) {
      this.subscribeToSaveResponse(this.vendedorService.update(vendedor));
    } else {
      this.subscribeToSaveResponse(this.vendedorService.create(vendedor));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVendedor>>): void {
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

  protected updateForm(vendedor: IVendedor): void {
    this.vendedor = vendedor;
    this.vendedorFormService.resetForm(this.editForm, vendedor);
  }
}
