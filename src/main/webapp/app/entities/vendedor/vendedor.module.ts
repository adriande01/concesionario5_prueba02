import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VendedorComponent } from './list/vendedor.component';
import { VendedorDetailComponent } from './detail/vendedor-detail.component';
import { VendedorUpdateComponent } from './update/vendedor-update.component';
import { VendedorDeleteDialogComponent } from './delete/vendedor-delete-dialog.component';
import { VendedorRoutingModule } from './route/vendedor-routing.module';

@NgModule({
  imports: [SharedModule, VendedorRoutingModule],
  declarations: [VendedorComponent, VendedorDetailComponent, VendedorUpdateComponent, VendedorDeleteDialogComponent],
})
export class VendedorModule {}
