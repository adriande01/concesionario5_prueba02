import dayjs from 'dayjs/esm';

import { IVenta, NewVenta } from './venta.model';

export const sampleWithRequiredData: IVenta = {
  id: 20448,
  total: 11440,
  fecha: dayjs('2022-09-14'),
};

export const sampleWithPartialData: IVenta = {
  id: 32725,
  total: 11474,
  fecha: dayjs('2022-09-15'),
};

export const sampleWithFullData: IVenta = {
  id: 56225,
  total: 71903,
  fecha: dayjs('2022-09-15'),
};

export const sampleWithNewData: NewVenta = {
  total: 41728,
  fecha: dayjs('2022-09-15'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
