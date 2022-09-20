import { Combustible } from 'app/entities/enumerations/combustible.model';

import { IVehiculo, NewVehiculo } from './vehiculo.model';

export const sampleWithRequiredData: IVehiculo = {
  id: 59193,
  modeloName: 'HTTP',
  marcaName: 'Negro neutral',
  precio: 3559,
};

export const sampleWithPartialData: IVehiculo = {
  id: 67944,
  modeloName: 'Grupo wireless override',
  marcaName: 'Rojo Croacia cliente',
  precio: 92602,
  hibrido: true,
};

export const sampleWithFullData: IVehiculo = {
  id: 10947,
  modeloName: 'Acero Humano La',
  marcaName: 'deposit plug-and-play Borders',
  precio: 58793,
  tipo: Combustible['DIESEL'],
  hibrido: true,
};

export const sampleWithNewData: NewVehiculo = {
  modeloName: 'Argentine 1080p',
  marcaName: 'Extremadura Borders',
  precio: 64391,
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
