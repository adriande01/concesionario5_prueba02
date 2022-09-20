import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVenta, NewVenta } from '../venta.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVenta for edit and NewVentaFormGroupInput for create.
 */
type VentaFormGroupInput = IVenta | PartialWithRequiredKeyOf<NewVenta>;

type VentaFormDefaults = Pick<NewVenta, 'id'>;

type VentaFormGroupContent = {
  id: FormControl<IVenta['id'] | NewVenta['id']>;
  total: FormControl<IVenta['total']>;
  fecha: FormControl<IVenta['fecha']>;
  vehiculo: FormControl<IVenta['vehiculo']>;
  cliente: FormControl<IVenta['cliente']>;
  vendedor: FormControl<IVenta['vendedor']>;
};

export type VentaFormGroup = FormGroup<VentaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VentaFormService {
  createVentaFormGroup(venta: VentaFormGroupInput = { id: null }): VentaFormGroup {
    const ventaRawValue = {
      ...this.getFormDefaults(),
      ...venta,
    };
    return new FormGroup<VentaFormGroupContent>({
      id: new FormControl(
        { value: ventaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      total: new FormControl(ventaRawValue.total, {
        validators: [Validators.required],
      }),
      fecha: new FormControl(ventaRawValue.fecha, {
        validators: [Validators.required],
      }),
      vehiculo: new FormControl(ventaRawValue.vehiculo),
      cliente: new FormControl(ventaRawValue.cliente),
      vendedor: new FormControl(ventaRawValue.vendedor),
    });
  }

  getVenta(form: VentaFormGroup): IVenta | NewVenta {
    return form.getRawValue() as IVenta | NewVenta;
  }

  resetForm(form: VentaFormGroup, venta: VentaFormGroupInput): void {
    const ventaRawValue = { ...this.getFormDefaults(), ...venta };
    form.reset(
      {
        ...ventaRawValue,
        id: { value: ventaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VentaFormDefaults {
    return {
      id: null,
    };
  }
}
