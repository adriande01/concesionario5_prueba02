import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVenta } from '../venta.model';
import { VentaService } from '../service/venta.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './venta-delete-dialog.component.html',
})
export class VentaDeleteDialogComponent {
  venta?: IVenta;

  constructor(protected ventaService: VentaService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.ventaService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
