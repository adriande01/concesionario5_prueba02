import dayjs from 'dayjs/esm';
import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';

export interface IVenta {
  id: number;
  total?: number | null;
  fecha?: dayjs.Dayjs | null;
  vehiculo?: IVehiculo | null;
  cliente?: ICliente | null;
  vendedor?: IVendedor | null;
}

export type NewVenta = Omit<IVenta, 'id'> & { id: null };
