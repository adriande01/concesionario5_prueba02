import { Combustible } from 'app/entities/enumerations/combustible.model';

import { IVehiculo, NewVehiculo } from './vehiculo.model';

export const sampleWithRequiredData: IVehiculo = {
  id: 59193,
  modeloName: 'HTTP',
  marcaName: 'Negro neutral',
  precio: 3559,
};

export const sampleWithPartialData: IVehiculo = {
  id: 78394,
  modeloName: 'mindshare Escudo Verde',
  marcaName: 'Hogar',
  precio: 23232,
  hibrido: true,
  reservado: false,
};

export const sampleWithFullData: IVehiculo = {
  id: 16547,
  modeloName: 'Cuentas',
  marcaName: 'Acero Humano La',
  precio: 98430,
  tipo: Combustible['DIESEL'],
  hibrido: false,
  reservado: false,
};

export const sampleWithNewData: NewVehiculo = {
  modeloName: 'Contabilidad Liechtenstein',
  marcaName: 'Valenciana Ladrillo payment',
  precio: 70400,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
