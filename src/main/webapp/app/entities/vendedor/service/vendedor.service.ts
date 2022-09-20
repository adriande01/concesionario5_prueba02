import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVendedor, NewVendedor } from '../vendedor.model';

export type PartialUpdateVendedor = Partial<IVendedor> & Pick<IVendedor, 'id'>;

type RestOf<T extends IVendedor | NewVendedor> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

export type RestVendedor = RestOf<IVendedor>;

export type NewRestVendedor = RestOf<NewVendedor>;

export type PartialUpdateRestVendedor = RestOf<PartialUpdateVendedor>;

export type EntityResponseType = HttpResponse<IVendedor>;
export type EntityArrayResponseType = HttpResponse<IVendedor[]>;

@Injectable({ providedIn: 'root' })
export class VendedorService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/vendedors');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(vendedor: NewVendedor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vendedor);
    return this.http
      .post<RestVendedor>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(vendedor: IVendedor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vendedor);
    return this.http
      .put<RestVendedor>(`${this.resourceUrl}/${this.getVendedorIdentifier(vendedor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(vendedor: PartialUpdateVendedor): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(vendedor);
    return this.http
      .patch<RestVendedor>(`${this.resourceUrl}/${this.getVendedorIdentifier(vendedor)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVendedor>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVendedor[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVendedorIdentifier(vendedor: Pick<IVendedor, 'id'>): number {
    return vendedor.id;
  }

  compareVendedor(o1: Pick<IVendedor, 'id'> | null, o2: Pick<IVendedor, 'id'> | null): boolean {
    return o1 && o2 ? this.getVendedorIdentifier(o1) === this.getVendedorIdentifier(o2) : o1 === o2;
  }

  addVendedorToCollectionIfMissing<Type extends Pick<IVendedor, 'id'>>(
    vendedorCollection: Type[],
    ...vendedorsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const vendedors: Type[] = vendedorsToCheck.filter(isPresent);
    if (vendedors.length > 0) {
      const vendedorCollectionIdentifiers = vendedorCollection.map(vendedorItem => this.getVendedorIdentifier(vendedorItem)!);
      const vendedorsToAdd = vendedors.filter(vendedorItem => {
        const vendedorIdentifier = this.getVendedorIdentifier(vendedorItem);
        if (vendedorCollectionIdentifiers.includes(vendedorIdentifier)) {
          return false;
        }
        vendedorCollectionIdentifiers.push(vendedorIdentifier);
        return true;
      });
      return [...vendedorsToAdd, ...vendedorCollection];
    }
    return vendedorCollection;
  }

  protected convertDateFromClient<T extends IVendedor | NewVendedor | PartialUpdateVendedor>(vendedor: T): RestOf<T> {
    return {
      ...vendedor,
      hireDate: vendedor.hireDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restVendedor: RestVendedor): IVendedor {
    return {
      ...restVendedor,
      hireDate: restVendedor.hireDate ? dayjs(restVendedor.hireDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVendedor>): HttpResponse<IVendedor> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVendedor[]>): HttpResponse<IVendedor[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
