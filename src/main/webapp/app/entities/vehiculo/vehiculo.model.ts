import { Combustible } from 'app/entities/enumerations/combustible.model';

export interface IVehiculo {
  id: number;
  modeloName?: string | null;
  marcaName?: string | null;
  precio?: number | null;
  tipo?: Combustible | null;
  hibrido?: boolean | null;
  reservado?: boolean | null;
}

export type NewVehiculo = Omit<IVehiculo, 'id'> & { id: null };
