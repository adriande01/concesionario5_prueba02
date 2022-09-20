import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICliente, NewCliente } from '../cliente.model';

export type PartialUpdateCliente = Partial<ICliente> & Pick<ICliente, 'id'>;

export type EntityResponseType = HttpResponse<ICliente>;
export type EntityArrayResponseType = HttpResponse<ICliente[]>;

@Injectable({ providedIn: 'root' })
export class ClienteService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/clientes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(cliente: NewCliente): Observable<EntityResponseType> {
    return this.http.post<ICliente>(this.resourceUrl, cliente, { observe: 'response' });
  }

  update(cliente: ICliente): Observable<EntityResponseType> {
    return this.http.put<ICliente>(`${this.resourceUrl}/${this.getClienteIdentifier(cliente)}`, cliente, { observe: 'response' });
  }

  partialUpdate(cliente: PartialUpdateCliente): Observable<EntityResponseType> {
    return this.http.patch<ICliente>(`${this.resourceUrl}/${this.getClienteIdentifier(cliente)}`, cliente, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICliente>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICliente[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getClienteIdentifier(cliente: Pick<ICliente, 'id'>): number {
    return cliente.id;
  }

  compareCliente(o1: Pick<ICliente, 'id'> | null, o2: Pick<ICliente, 'id'> | null): boolean {
    return o1 && o2 ? this.getClienteIdentifier(o1) === this.getClienteIdentifier(o2) : o1 === o2;
  }

  addClienteToCollectionIfMissing<Type extends Pick<ICliente, 'id'>>(
    clienteCollection: Type[],
    ...clientesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const clientes: Type[] = clientesToCheck.filter(isPresent);
    if (clientes.length > 0) {
      const clienteCollectionIdentifiers = clienteCollection.map(clienteItem => this.getClienteIdentifier(clienteItem)!);
      const clientesToAdd = clientes.filter(clienteItem => {
        const clienteIdentifier = this.getClienteIdentifier(clienteItem);
        if (clienteCollectionIdentifiers.includes(clienteIdentifier)) {
          return false;
        }
        clienteCollectionIdentifiers.push(clienteIdentifier);
        return true;
      });
      return [...clientesToAdd, ...clienteCollection];
    }
    return clienteCollection;
  }
}
