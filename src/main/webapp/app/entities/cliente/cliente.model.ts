export interface ICliente {
  id: number;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  streetAddress?: string | null;
  postalCode?: string | null;
  city?: string | null;
  stateProvince?: string | null;
}

export type NewCliente = Omit<ICliente, 'id'> & { id: null };
