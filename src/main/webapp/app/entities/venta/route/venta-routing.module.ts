import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VentaComponent } from '../list/venta.component';
import { VentaDetailComponent } from '../detail/venta-detail.component';
import { VentaUpdateComponent } from '../update/venta-update.component';
import { VentaRoutingResolveService } from './venta-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const ventaRoute: Routes = [
  {
    path: '',
    component: VentaComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VentaDetailComponent,
    resolve: {
      venta: VentaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VentaUpdateComponent,
    resolve: {
      venta: VentaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VentaUpdateComponent,
    resolve: {
      venta: VentaRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(ventaRoute)],
  exports: [RouterModule],
})
export class VentaRoutingModule {}
