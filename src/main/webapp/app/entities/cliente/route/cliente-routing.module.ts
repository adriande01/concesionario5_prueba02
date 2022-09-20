import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ClienteComponent } from '../list/cliente.component';
import { ClienteDetailComponent } from '../detail/cliente-detail.component';
import { ClienteUpdateComponent } from '../update/cliente-update.component';
import { ClienteRoutingResolveService } from './cliente-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const clienteRoute: Routes = [
  {
    path: '',
    component: ClienteComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: ClienteDetailComponent,
    resolve: {
      cliente: ClienteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ClienteUpdateComponent,
    resolve: {
      cliente: ClienteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ClienteUpdateComponent,
    resolve: {
      cliente: ClienteRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(clienteRoute)],
  exports: [RouterModule],
})
export class ClienteRoutingModule {}
