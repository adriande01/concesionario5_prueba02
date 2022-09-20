import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IVendedor, NewVendedor } from '../vendedor.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVendedor for edit and NewVendedorFormGroupInput for create.
 */
type VendedorFormGroupInput = IVendedor | PartialWithRequiredKeyOf<NewVendedor>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IVendedor | NewVendedor> = Omit<T, 'hireDate'> & {
  hireDate?: string | null;
};

type VendedorFormRawValue = FormValueOf<IVendedor>;

type NewVendedorFormRawValue = FormValueOf<NewVendedor>;

type VendedorFormDefaults = Pick<NewVendedor, 'id' | 'hireDate'>;

type VendedorFormGroupContent = {
  id: FormControl<VendedorFormRawValue['id'] | NewVendedor['id']>;
  firstName: FormControl<VendedorFormRawValue['firstName']>;
  lastName: FormControl<VendedorFormRawValue['lastName']>;
  email: FormControl<VendedorFormRawValue['email']>;
  phoneNumber: FormControl<VendedorFormRawValue['phoneNumber']>;
  hireDate: FormControl<VendedorFormRawValue['hireDate']>;
  salary: FormControl<VendedorFormRawValue['salary']>;
  commissionPct: FormControl<VendedorFormRawValue['commissionPct']>;
};

export type VendedorFormGroup = FormGroup<VendedorFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VendedorFormService {
  createVendedorFormGroup(vendedor: VendedorFormGroupInput = { id: null }): VendedorFormGroup {
    const vendedorRawValue = this.convertVendedorToVendedorRawValue({
      ...this.getFormDefaults(),
      ...vendedor,
    });
    return new FormGroup<VendedorFormGroupContent>({
      id: new FormControl(
        { value: vendedorRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(vendedorRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(vendedorRawValue.lastName, {
        validators: [Validators.required],
      }),
      email: new FormControl(vendedorRawValue.email, {
        validators: [Validators.required],
      }),
      phoneNumber: new FormControl(vendedorRawValue.phoneNumber, {
        validators: [Validators.required],
      }),
      hireDate: new FormControl(vendedorRawValue.hireDate, {
        validators: [Validators.required],
      }),
      salary: new FormControl(vendedorRawValue.salary, {
        validators: [Validators.required],
      }),
      commissionPct: new FormControl(vendedorRawValue.commissionPct, {
        validators: [Validators.required],
      }),
    });
  }

  getVendedor(form: VendedorFormGroup): IVendedor | NewVendedor {
    return this.convertVendedorRawValueToVendedor(form.getRawValue() as VendedorFormRawValue | NewVendedorFormRawValue);
  }

  resetForm(form: VendedorFormGroup, vendedor: VendedorFormGroupInput): void {
    const vendedorRawValue = this.convertVendedorToVendedorRawValue({ ...this.getFormDefaults(), ...vendedor });
    form.reset(
      {
        ...vendedorRawValue,
        id: { value: vendedorRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VendedorFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      hireDate: currentTime,
    };
  }

  private convertVendedorRawValueToVendedor(rawVendedor: VendedorFormRawValue | NewVendedorFormRawValue): IVendedor | NewVendedor {
    return {
      ...rawVendedor,
      hireDate: dayjs(rawVendedor.hireDate, DATE_TIME_FORMAT),
    };
  }

  private convertVendedorToVendedorRawValue(
    vendedor: IVendedor | (Partial<NewVendedor> & VendedorFormDefaults)
  ): VendedorFormRawValue | PartialWithRequiredKeyOf<NewVendedorFormRawValue> {
    return {
      ...vendedor,
      hireDate: vendedor.hireDate ? vendedor.hireDate.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
