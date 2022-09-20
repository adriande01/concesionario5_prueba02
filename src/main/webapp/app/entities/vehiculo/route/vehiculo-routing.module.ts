import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VehiculoComponent } from '../list/vehiculo.component';
import { VehiculoDetailComponent } from '../detail/vehiculo-detail.component';
import { VehiculoUpdateComponent } from '../update/vehiculo-update.component';
import { VehiculoRoutingResolveService } from './vehiculo-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const vehiculoRoute: Routes = [
  {
    path: '',
    component: VehiculoComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VehiculoDetailComponent,
    resolve: {
      vehiculo: VehiculoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VehiculoUpdateComponent,
    resolve: {
      vehiculo: VehiculoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VehiculoUpdateComponent,
    resolve: {
      vehiculo: VehiculoRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(vehiculoRoute)],
  exports: [RouterModule],
})
export class VehiculoRoutingModule {}
