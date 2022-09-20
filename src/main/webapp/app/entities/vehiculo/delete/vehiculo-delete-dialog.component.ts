import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVehiculo } from '../vehiculo.model';
import { VehiculoService } from '../service/vehiculo.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './vehiculo-delete-dialog.component.html',
})
export class VehiculoDeleteDialogComponent {
  vehiculo?: IVehiculo;

  constructor(protected vehiculoService: VehiculoService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.vehiculoService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
