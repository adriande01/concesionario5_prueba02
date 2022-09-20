import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVenta } from '../venta.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../venta.test-samples';

import { VentaService, RestVenta } from './venta.service';

const requireRestSample: RestVenta = {
  ...sampleWithRequiredData,
  fecha: sampleWithRequiredData.fecha?.format(DATE_FORMAT),
};

describe('Venta Service', () => {
  let service: VentaService;
  let httpMock: HttpTestingController;
  let expectedResult: IVenta | IVenta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VentaService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Venta', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const venta = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(venta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Venta', () => {
      const venta = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(venta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Venta', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Venta', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Venta', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVentaToCollectionIfMissing', () => {
      it('should add a Venta to an empty array', () => {
        const venta: IVenta = sampleWithRequiredData;
        expectedResult = service.addVentaToCollectionIfMissing([], venta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(venta);
      });

      it('should not add a Venta to an array that contains it', () => {
        const venta: IVenta = sampleWithRequiredData;
        const ventaCollection: IVenta[] = [
          {
            ...venta,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVentaToCollectionIfMissing(ventaCollection, venta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Venta to an array that doesn't contain it", () => {
        const venta: IVenta = sampleWithRequiredData;
        const ventaCollection: IVenta[] = [sampleWithPartialData];
        expectedResult = service.addVentaToCollectionIfMissing(ventaCollection, venta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(venta);
      });

      it('should add only unique Venta to an array', () => {
        const ventaArray: IVenta[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const ventaCollection: IVenta[] = [sampleWithRequiredData];
        expectedResult = service.addVentaToCollectionIfMissing(ventaCollection, ...ventaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const venta: IVenta = sampleWithRequiredData;
        const venta2: IVenta = sampleWithPartialData;
        expectedResult = service.addVentaToCollectionIfMissing([], venta, venta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(venta);
        expect(expectedResult).toContain(venta2);
      });

      it('should accept null and undefined values', () => {
        const venta: IVenta = sampleWithRequiredData;
        expectedResult = service.addVentaToCollectionIfMissing([], null, venta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(venta);
      });

      it('should return initial array if no Venta is added', () => {
        const ventaCollection: IVenta[] = [sampleWithRequiredData];
        expectedResult = service.addVentaToCollectionIfMissing(ventaCollection, undefined, null);
        expect(expectedResult).toEqual(ventaCollection);
      });
    });

    describe('compareVenta', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVenta(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVenta(entity1, entity2);
        const compareResult2 = service.compareVenta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVenta(entity1, entity2);
        const compareResult2 = service.compareVenta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVenta(entity1, entity2);
        const compareResult2 = service.compareVenta(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
