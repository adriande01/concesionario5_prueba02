import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVehiculo, NewVehiculo } from '../vehiculo.model';

export type PartialUpdateVehiculo = Partial<IVehiculo> & Pick<IVehiculo, 'id'>;

export type EntityResponseType = HttpResponse<IVehiculo>;
export type EntityArrayResponseType = HttpResponse<IVehiculo[]>;

@Injectable({ providedIn: 'root' })
export class VehiculoService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vehiculos');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vehiculo: NewVehiculo): Observable<EntityResponseType> {
    return this.http.post<IVehiculo>(this.resourceUrl, vehiculo, { observe: 'response' });
  }

  update(vehiculo: IVehiculo): Observable<EntityResponseType> {
    return this.http.put<IVehiculo>(`${this.resourceUrl}/${this.getVehiculoIdentifier(vehiculo)}`, vehiculo, { observe: 'response' });
  }

  partialUpdate(vehiculo: PartialUpdateVehiculo): Observable<EntityResponseType> {
    return this.http.patch<IVehiculo>(`${this.resourceUrl}/${this.getVehiculoIdentifier(vehiculo)}`, vehiculo, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IVehiculo>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IVehiculo[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVehiculoIdentifier(vehiculo: Pick<IVehiculo, 'id'>): number {
    return vehiculo.id;
  }

  compareVehiculo(o1: Pick<IVehiculo, 'id'> | null, o2: Pick<IVehiculo, 'id'> | null): boolean {
    return o1 && o2 ? this.getVehiculoIdentifier(o1) === this.getVehiculoIdentifier(o2) : o1 === o2;
  }

  addVehiculoToCollectionIfMissing<Type extends Pick<IVehiculo, 'id'>>(
    vehiculoCollection: Type[],
    ...vehiculosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vehiculos: Type[] = vehiculosToCheck.filter(isPresent);
    if (vehiculos.length > 0) {
      const vehiculoCollectionIdentifiers = vehiculoCollection.map(vehiculoItem => this.getVehiculoIdentifier(vehiculoItem)!);
      const vehiculosToAdd = vehiculos.filter(vehiculoItem => {
        const vehiculoIdentifier = this.getVehiculoIdentifier(vehiculoItem);
        if (vehiculoCollectionIdentifiers.includes(vehiculoIdentifier)) {
          return false;
        }
        vehiculoCollectionIdentifiers.push(vehiculoIdentifier);
        return true;
      });
      return [...vehiculosToAdd, ...vehiculoCollection];
    }
    return vehiculoCollection;
  }
}
