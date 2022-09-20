import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICliente } from '../cliente.model';

@Component({
  selector: 'jhi-cliente-detail',
  templateUrl: './cliente-detail.component.html',
})
export class ClienteDetailComponent implements OnInit {
  cliente: ICliente | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ cliente }) => {
      this.cliente = cliente;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
