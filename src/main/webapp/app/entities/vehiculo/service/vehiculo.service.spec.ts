import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IVehiculo } from '../vehiculo.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../vehiculo.test-samples';

import { VehiculoService } from './vehiculo.service';

const requireRestSample: IVehiculo = {
  ...sampleWithRequiredData,
};

describe('Vehiculo Service', () => {
  let service: VehiculoService;
  let httpMock: HttpTestingController;
  let expectedResult: IVehiculo | IVehiculo[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VehiculoService);
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

    it('should create a Vehiculo', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const vehiculo = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(vehiculo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Vehiculo', () => {
      const vehiculo = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(vehiculo).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Vehiculo', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Vehiculo', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Vehiculo', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVehiculoToCollectionIfMissing', () => {
      it('should add a Vehiculo to an empty array', () => {
        const vehiculo: IVehiculo = sampleWithRequiredData;
        expectedResult = service.addVehiculoToCollectionIfMissing([], vehiculo);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehiculo);
      });

      it('should not add a Vehiculo to an array that contains it', () => {
        const vehiculo: IVehiculo = sampleWithRequiredData;
        const vehiculoCollection: IVehiculo[] = [
          {
            ...vehiculo,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVehiculoToCollectionIfMissing(vehiculoCollection, vehiculo);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Vehiculo to an array that doesn't contain it", () => {
        const vehiculo: IVehiculo = sampleWithRequiredData;
        const vehiculoCollection: IVehiculo[] = [sampleWithPartialData];
        expectedResult = service.addVehiculoToCollectionIfMissing(vehiculoCollection, vehiculo);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehiculo);
      });

      it('should add only unique Vehiculo to an array', () => {
        const vehiculoArray: IVehiculo[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const vehiculoCollection: IVehiculo[] = [sampleWithRequiredData];
        expectedResult = service.addVehiculoToCollectionIfMissing(vehiculoCollection, ...vehiculoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const vehiculo: IVehiculo = sampleWithRequiredData;
        const vehiculo2: IVehiculo = sampleWithPartialData;
        expectedResult = service.addVehiculoToCollectionIfMissing([], vehiculo, vehiculo2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(vehiculo);
        expect(expectedResult).toContain(vehiculo2);
      });

      it('should accept null and undefined values', () => {
        const vehiculo: IVehiculo = sampleWithRequiredData;
        expectedResult = service.addVehiculoToCollectionIfMissing([], null, vehiculo, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(vehiculo);
      });

      it('should return initial array if no Vehiculo is added', () => {
        const vehiculoCollection: IVehiculo[] = [sampleWithRequiredData];
        expectedResult = service.addVehiculoToCollectionIfMissing(vehiculoCollection, undefined, null);
        expect(expectedResult).toEqual(vehiculoCollection);
      });
    });

    describe('compareVehiculo', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVehiculo(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVehiculo(entity1, entity2);
        const compareResult2 = service.compareVehiculo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVehiculo(entity1, entity2);
        const compareResult2 = service.compareVehiculo(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVehiculo(entity1, entity2);
        const compareResult2 = service.compareVehiculo(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
