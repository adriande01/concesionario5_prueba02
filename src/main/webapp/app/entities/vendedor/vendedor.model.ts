import dayjs from 'dayjs/esm';

export interface IVendedor {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  hireDate?: dayjs.Dayjs | null;
  salary?: number | null;
  commissionPct?: number | null;
}

export type NewVendedor = Omit<IVendedor, 'id'> & { id: null };
