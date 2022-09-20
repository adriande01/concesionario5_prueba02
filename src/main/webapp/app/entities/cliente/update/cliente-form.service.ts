import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICliente, NewCliente } from '../cliente.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICliente for edit and NewClienteFormGroupInput for create.
 */
type ClienteFormGroupInput = ICliente | PartialWithRequiredKeyOf<NewCliente>;

type ClienteFormDefaults = Pick<NewCliente, 'id'>;

type ClienteFormGroupContent = {
  id: FormControl<ICliente['id'] | NewCliente['id']>;
  firstName: FormControl<ICliente['firstName']>;
  lastName: FormControl<ICliente['lastName']>;
  email: FormControl<ICliente['email']>;
  phoneNumber: FormControl<ICliente['phoneNumber']>;
  streetAddress: FormControl<ICliente['streetAddress']>;
  postalCode: FormControl<ICliente['postalCode']>;
  city: FormControl<ICliente['city']>;
  stateProvince: FormControl<ICliente['stateProvince']>;
};

export type ClienteFormGroup = FormGroup<ClienteFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ClienteFormService {
  createClienteFormGroup(cliente: ClienteFormGroupInput = { id: null }): ClienteFormGroup {
    const clienteRawValue = {
      ...this.getFormDefaults(),
      ...cliente,
    };
    return new FormGroup<ClienteFormGroupContent>({
      id: new FormControl(
        { value: clienteRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(clienteRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(clienteRawValue.lastName, {
        validators: [Validators.required],
      }),
      email: new FormControl(clienteRawValue.email),
      phoneNumber: new FormControl(clienteRawValue.phoneNumber, {
        validators: [Validators.required],
      }),
      streetAddress: new FormControl(clienteRawValue.streetAddress),
      postalCode: new FormControl(clienteRawValue.postalCode),
      city: new FormControl(clienteRawValue.city),
      stateProvince: new FormControl(clienteRawValue.stateProvince),
    });
  }

  getCliente(form: ClienteFormGroup): ICliente | NewCliente {
    return form.getRawValue() as ICliente | NewCliente;
  }

  resetForm(form: ClienteFormGroup, cliente: ClienteFormGroupInput): void {
    const clienteRawValue = { ...this.getFormDefaults(), ...cliente };
    form.reset(
      {
        ...clienteRawValue,
        id: { value: clienteRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ClienteFormDefaults {
    return {
      id: null,
    };
  }
}
