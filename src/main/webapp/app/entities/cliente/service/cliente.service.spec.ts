import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICliente } from '../cliente.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../cliente.test-samples';

import { ClienteService } from './cliente.service';

const requireRestSample: ICliente = {
  ...sampleWithRequiredData,
};

describe('Cliente Service', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  let expectedResult: ICliente | ICliente[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ClienteService);
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

    it('should create a Cliente', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const cliente = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(cliente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Cliente', () => {
      const cliente = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(cliente).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Cliente', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Cliente', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Cliente', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addClienteToCollectionIfMissing', () => {
      it('should add a Cliente to an empty array', () => {
        const cliente: ICliente = sampleWithRequiredData;
        expectedResult = service.addClienteToCollectionIfMissing([], cliente);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cliente);
      });

      it('should not add a Cliente to an array that contains it', () => {
        const cliente: ICliente = sampleWithRequiredData;
        const clienteCollection: ICliente[] = [
          {
            ...cliente,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addClienteToCollectionIfMissing(clienteCollection, cliente);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Cliente to an array that doesn't contain it", () => {
        const cliente: ICliente = sampleWithRequiredData;
        const clienteCollection: ICliente[] = [sampleWithPartialData];
        expectedResult = service.addClienteToCollectionIfMissing(clienteCollection, cliente);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cliente);
      });

      it('should add only unique Cliente to an array', () => {
        const clienteArray: ICliente[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const clienteCollection: ICliente[] = [sampleWithRequiredData];
        expectedResult = service.addClienteToCollectionIfMissing(clienteCollection, ...clienteArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const cliente: ICliente = sampleWithRequiredData;
        const cliente2: ICliente = sampleWithPartialData;
        expectedResult = service.addClienteToCollectionIfMissing([], cliente, cliente2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(cliente);
        expect(expectedResult).toContain(cliente2);
      });

      it('should accept null and undefined values', () => {
        const cliente: ICliente = sampleWithRequiredData;
        expectedResult = service.addClienteToCollectionIfMissing([], null, cliente, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(cliente);
      });

      it('should return initial array if no Cliente is added', () => {
        const clienteCollection: ICliente[] = [sampleWithRequiredData];
        expectedResult = service.addClienteToCollectionIfMissing(clienteCollection, undefined, null);
        expect(expectedResult).toEqual(clienteCollection);
      });
    });

    describe('compareCliente', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCliente(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCliente(entity1, entity2);
        const compareResult2 = service.compareCliente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCliente(entity1, entity2);
        const compareResult2 = service.compareCliente(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCliente(entity1, entity2);
        const compareResult2 = service.compareCliente(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
