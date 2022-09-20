import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVendedor } from '../vendedor.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vendedor.test-samples';

import { VendedorService, RestVendedor } from './vendedor.service';

const requireRestSample: RestVendedor = {
  ...sampleWithRequiredData,
  hireDate: sampleWithRequiredData.hireDate?.toJSON(),
};

describe('Vendedor Service', () => {
  let service: VendedorService;
  let httpMock: HttpTestingController;
  let expectedResult: IVendedor | IVendedor[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VendedorService);
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

    it('should create a Vendedor', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vendedor = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vendedor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vendedor', () => {
      const vendedor = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vendedor).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vendedor', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vendedor', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vendedor', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVendedorToCollectionIfMissing', () => {
      it('should add a Vendedor to an empty array', () => {
        const vendedor: IVendedor = sampleWithRequiredData;
        expectedResult = service.addVendedorToCollectionIfMissing([], vendedor);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vendedor);
      });

      it('should not add a Vendedor to an array that contains it', () => {
        const vendedor: IVendedor = sampleWithRequiredData;
        const vendedorCollection: IVendedor[] = [
          {
            ...vendedor,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVendedorToCollectionIfMissing(vendedorCollection, vendedor);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vendedor to an array that doesn't contain it", () => {
        const vendedor: IVendedor = sampleWithRequiredData;
        const vendedorCollection: IVendedor[] = [sampleWithPartialData];
        expectedResult = service.addVendedorToCollectionIfMissing(vendedorCollection, vendedor);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vendedor);
      });

      it('should add only unique Vendedor to an array', () => {
        const vendedorArray: IVendedor[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vendedorCollection: IVendedor[] = [sampleWithRequiredData];
        expectedResult = service.addVendedorToCollectionIfMissing(vendedorCollection, ...vendedorArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vendedor: IVendedor = sampleWithRequiredData;
        const vendedor2: IVendedor = sampleWithPartialData;
        expectedResult = service.addVendedorToCollectionIfMissing([], vendedor, vendedor2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vendedor);
        expect(expectedResult).toContain(vendedor2);
      });

      it('should accept null and undefined values', () => {
        const vendedor: IVendedor = sampleWithRequiredData;
        expectedResult = service.addVendedorToCollectionIfMissing([], null, vendedor, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vendedor);
      });

      it('should return initial array if no Vendedor is added', () => {
        const vendedorCollection: IVendedor[] = [sampleWithRequiredData];
        expectedResult = service.addVendedorToCollectionIfMissing(vendedorCollection, undefined, null);
        expect(expectedResult).toEqual(vendedorCollection);
      });
    });

    describe('compareVendedor', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVendedor(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVendedor(entity1, entity2);
        const compareResult2 = service.compareVendedor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVendedor(entity1, entity2);
        const compareResult2 = service.compareVendedor(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVendedor(entity1, entity2);
        const compareResult2 = service.compareVendedor(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
