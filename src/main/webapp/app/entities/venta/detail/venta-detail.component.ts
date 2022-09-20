import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVenta } from '../venta.model';

@Component({
  selector: 'jhi-venta-detail',
  templateUrl: './venta-detail.component.html',
})
export class VentaDetailComponent implements OnInit {
  venta: IVenta | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ venta }) => {
      this.venta = venta;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
