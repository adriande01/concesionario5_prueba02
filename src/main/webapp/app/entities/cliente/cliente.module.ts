import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ClienteComponent } from './list/cliente.component';
import { ClienteDetailComponent } from './detail/cliente-detail.component';
import { ClienteUpdateComponent } from './update/cliente-update.component';
import { ClienteDeleteDialogComponent } from './delete/cliente-delete-dialog.component';
import { ClienteRoutingModule } from './route/cliente-routing.module';

@NgModule({
  imports: [SharedModule, ClienteRoutingModule],
  declarations: [ClienteComponent, ClienteDetailComponent, ClienteUpdateComponent, ClienteDeleteDialogComponent],
})
export class ClienteModule {}
