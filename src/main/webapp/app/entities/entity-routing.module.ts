import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'venta',
        data: { pageTitle: 'concesionario5App.venta.home.title' },
        loadChildren: () => import('./venta/venta.module').then(m => m.VentaModule),
      },
      {
        path: 'cliente',
        data: { pageTitle: 'concesionario5App.cliente.home.title' },
        loadChildren: () => import('./cliente/cliente.module').then(m => m.ClienteModule),
      },
      {
        path: 'vendedor',
        data: { pageTitle: 'concesionario5App.vendedor.home.title' },
        loadChildren: () => import('./vendedor/vendedor.module').then(m => m.VendedorModule),
      },
      {
        path: 'vehiculo',
        data: { pageTitle: 'concesionario5App.vehiculo.home.title' },
        loadChildren: () => import('./vehiculo/vehiculo.module').then(m => m.VehiculoModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
