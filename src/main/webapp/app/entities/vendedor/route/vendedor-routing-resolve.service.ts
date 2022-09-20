import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVendedor } from '../vendedor.model';
import { VendedorService } from '../service/vendedor.service';

@Injectable({ providedIn: 'root' })
export class VendedorRoutingResolveService implements Resolve<IVendedor | null> {
  constructor(protected service: VendedorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVendedor | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((vendedor: HttpResponse<IVendedor>) => {
          if (vendedor.body) {
            return of(vendedor.body);
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
