import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../venta.test-samples';

import { VentaFormService } from './venta-form.service';

describe('Venta Form Service', () => {
  let service: VentaFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VentaFormService);
  });

  describe('Service methods', () => {
    describe('createVentaFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVentaFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            total: expect.any(Object),
            fecha: expect.any(Object),
            vehiculo: expect.any(Object),
            cliente: expect.any(Object),
            vendedor: expect.any(Object),
          })
        );
      });

      it('passing IVenta should create a new form with FormGroup', () => {
        const formGroup = service.createVentaFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            total: expect.any(Object),
            fecha: expect.any(Object),
            vehiculo: expect.any(Object),
            cliente: expect.any(Object),
            vendedor: expect.any(Object),
          })
        );
      });
    });

    describe('getVenta', () => {
      it('should return NewVenta for default Venta initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVentaFormGroup(sampleWithNewData);

        const venta = service.getVenta(formGroup) as any;

        expect(venta).toMatchObject(sampleWithNewData);
      });

      it('should return NewVenta for empty Venta initial value', () => {
        const formGroup = service.createVentaFormGroup();

        const venta = service.getVenta(formGroup) as any;

        expect(venta).toMatchObject({});
      });

      it('should return IVenta', () => {
        const formGroup = service.createVentaFormGroup(sampleWithRequiredData);

        const venta = service.getVenta(formGroup) as any;

        expect(venta).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVenta should not enable id FormControl', () => {
        const formGroup = service.createVentaFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVenta should disable id FormControl', () => {
        const formGroup = service.createVentaFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
