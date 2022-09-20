import { ICliente, NewCliente } from './cliente.model';

export const sampleWithRequiredData: ICliente = {
  id: 45820,
  firstName: 'José Luis',
  lastName: 'Monroy',
  phoneNumber: 'Finlandia Travesía',
};

export const sampleWithPartialData: ICliente = {
  id: 37121,
  firstName: 'Yolanda',
  lastName: 'Esquivel',
  phoneNumber: 'HDD',
  city: 'Salem',
};

export const sampleWithFullData: ICliente = {
  id: 67077,
  firstName: 'Silvia',
  lastName: 'Álvarez',
  email: 'Gregorio.Cazares76@gmail.com',
  phoneNumber: 'Guam card',
  streetAddress: 'JBOD invoice',
  postalCode: 'Qatari flexibilidad',
  city: 'Marroquínstad',
  stateProvince: 'Plástico',
};

export const sampleWithNewData: NewCliente = {
  firstName: 'Nicolás',
  lastName: 'Delvalle',
  phoneNumber: 'Avon haptic Mesa',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
