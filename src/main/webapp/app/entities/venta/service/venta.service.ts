import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVenta, NewVenta } from '../venta.model';

export type PartialUpdateVenta = Partial<IVenta> & Pick<IVenta, 'id'>;

type RestOf<T extends IVenta | NewVenta> = Omit<T, 'fecha'> & {
  fecha?: string | null;
};

export type RestVenta = RestOf<IVenta>;

export type NewRestVenta = RestOf<NewVenta>;

export type PartialUpdateRestVenta = RestOf<PartialUpdateVenta>;

export type EntityResponseType = HttpResponse<IVenta>;
export type EntityArrayResponseType = HttpResponse<IVenta[]>;

@Injectable({ providedIn: 'root' })
export class VentaService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/ventas');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(venta: NewVenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(venta);
    return this.http.post<RestVenta>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(venta: IVenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(venta);
    return this.http
      .put<RestVenta>(`${this.resourceUrl}/${this.getVentaIdentifier(venta)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(venta: PartialUpdateVenta): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(venta);
    return this.http
      .patch<RestVenta>(`${this.resourceUrl}/${this.getVentaIdentifier(venta)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVenta>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVenta[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVentaIdentifier(venta: Pick<IVenta, 'id'>): number {
    return venta.id;
  }

  compareVenta(o1: Pick<IVenta, 'id'> | null, o2: Pick<IVenta, 'id'> | null): boolean {
    return o1 && o2 ? this.getVentaIdentifier(o1) === this.getVentaIdentifier(o2) : o1 === o2;
  }

  addVentaToCollectionIfMissing<Type extends Pick<IVenta, 'id'>>(
    ventaCollection: Type[],
    ...ventasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const ventas: Type[] = ventasToCheck.filter(isPresent);
    if (ventas.length > 0) {
      const ventaCollectionIdentifiers = ventaCollection.map(ventaItem => this.getVentaIdentifier(ventaItem)!);
      const ventasToAdd = ventas.filter(ventaItem => {
        const ventaIdentifier = this.getVentaIdentifier(ventaItem);
        if (ventaCollectionIdentifiers.includes(ventaIdentifier)) {
          return false;
        }
        ventaCollectionIdentifiers.push(ventaIdentifier);
        return true;
      });
      return [...ventasToAdd, ...ventaCollection];
    }
    return ventaCollection;
  }

  protected convertDateFromClient<T extends IVenta | NewVenta | PartialUpdateVenta>(venta: T): RestOf<T> {
    return {
      ...venta,
      fecha: venta.fecha?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVenta: RestVenta): IVenta {
    return {
      ...restVenta,
      fecha: restVenta.fecha ? dayjs(restVenta.fecha) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVenta>): HttpResponse<IVenta> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVenta[]>): HttpResponse<IVenta[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
