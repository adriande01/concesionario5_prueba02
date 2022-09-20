import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVehiculo } from '../vehiculo.model';
import { VehiculoService } from '../service/vehiculo.service';

@Injectable({ providedIn: 'root' })
export class VehiculoRoutingResolveService implements Resolve<IVehiculo | null> {
  constructor(protected service: VehiculoService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVehiculo | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vehiculo: HttpResponse<IVehiculo>) => {
          if (vehiculo.body) {
            return of(vehiculo.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
