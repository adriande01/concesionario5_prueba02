import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ClienteFormService, ClienteFormGroup } from './cliente-form.service';
import { ICliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';

@Component({
  selector: 'jhi-cliente-update',
  templateUrl: './cliente-update.component.html',
})
export class ClienteUpdateComponent implements OnInit {
  isSaving = false;
  cliente: ICliente | null = null;

  editForm: ClienteFormGroup = this.clienteFormService.createClienteFormGroup();

  constructor(
    protected clienteService: ClienteService,
    protected clienteFormService: ClienteFormService,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cliente }) => {
      this.cliente = cliente;
      if (cliente) {
        this.updateForm(cliente);
      }
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const cliente = this.clienteFormService.getCliente(this.editForm);
    if (cliente.id !== null) {
      this.subscribeToSaveResponse(this.clienteService.update(cliente));
    } else {
      this.subscribeToSaveResponse(this.clienteService.create(cliente));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICliente>>): void {
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

  protected updateForm(cliente: ICliente): void {
    this.cliente = cliente;
    this.clienteFormService.resetForm(this.editForm, cliente);
  }
}
