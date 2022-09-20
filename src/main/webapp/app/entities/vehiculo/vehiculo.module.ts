import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VehiculoComponent } from './list/vehiculo.component';
import { VehiculoDetailComponent } from './detail/vehiculo-detail.component';
import { VehiculoUpdateComponent } from './update/vehiculo-update.component';
import { VehiculoDeleteDialogComponent } from './delete/vehiculo-delete-dialog.component';
import { VehiculoRoutingModule } from './route/vehiculo-routing.module';

@NgModule({
  imports: [SharedModule, VehiculoRoutingModule],
  declarations: [VehiculoComponent, VehiculoDetailComponent, VehiculoUpdateComponent, VehiculoDeleteDialogComponent],
})
export class VehiculoModule {}
