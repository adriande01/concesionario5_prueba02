import dayjs from 'dayjs/esm';
import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';

export interface IVenta {
  id: number;
  total?: number | null;
  fecha?: dayjs.Dayjs | null;
  vehiculo?: Pick<IVehiculo, 'id' | 'marcaName' | 'modeloName'> | null;
  cliente?: Pick<ICliente, 'id' | 'firstName' | 'lastName'> | null;
  vendedor?: Pick<IVendedor, 'id' | 'firstName' | 'lastName'> | null;
}

export type NewVenta = Omit<IVenta, 'id'> & { id: null };
