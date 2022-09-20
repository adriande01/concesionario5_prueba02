import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../vendedor.test-samples';

import { VendedorFormService } from './vendedor-form.service';

describe('Vendedor Form Service', () => {
  let service: VendedorFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendedorFormService);
  });

  describe('Service methods', () => {
    describe('createVendedorFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVendedorFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            salary: expect.any(Object),
            commissionPct: expect.any(Object),
          })
        );
      });

      it('passing IVendedor should create a new form with FormGroup', () => {
        const formGroup = service.createVendedorFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            email: expect.any(Object),
            phoneNumber: expect.any(Object),
            hireDate: expect.any(Object),
            salary: expect.any(Object),
            commissionPct: expect.any(Object),
          })
        );
      });
    });

    describe('getVendedor', () => {
      it('should return NewVendedor for default Vendedor initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVendedorFormGroup(sampleWithNewData);

        const vendedor = service.getVendedor(formGroup) as any;

        expect(vendedor).toMatchObject(sampleWithNewData);
      });

      it('should return NewVendedor for empty Vendedor initial value', () => {
        const formGroup = service.createVendedorFormGroup();

        const vendedor = service.getVendedor(formGroup) as any;

        expect(vendedor).toMatchObject({});
      });

      it('should return IVendedor', () => {
        const formGroup = service.createVendedorFormGroup(sampleWithRequiredData);

        const vendedor = service.getVendedor(formGroup) as any;

        expect(vendedor).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVendedor should not enable id FormControl', () => {
        const formGroup = service.createVendedorFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVendedor should disable id FormControl', () => {
        const formGroup = service.createVendedorFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
