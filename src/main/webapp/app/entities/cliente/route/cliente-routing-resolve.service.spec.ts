import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, ActivatedRoute, Router, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ICliente } from '../cliente.model';
import { ClienteService } from '../service/cliente.service';

import { ClienteRoutingResolveService } from './cliente-routing-resolve.service';

describe('Cliente routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let routingResolveService: ClienteRoutingResolveService;
  let service: ClienteService;
  let resultCliente: ICliente | null | undefined;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate').mockImplementation(() => Promise.resolve(true));
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    routingResolveService = TestBed.inject(ClienteRoutingResolveService);
    service = TestBed.inject(ClienteService);
    resultCliente = undefined;
  });

  describe('resolve', () => {
    it('should return ICliente returned by find', () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCliente = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCliente).toEqual({ id: 123 });
    });

    it('should return null if id is not provided', () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCliente = result;
      });

      // THEN
      expect(service.find).not.toBeCalled();
      expect(resultCliente).toEqual(null);
    });

    it('should route to 404 page if data not found in server', () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ICliente>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: 123 };

      // WHEN
      routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
        resultCliente = result;
      });

      // THEN
      expect(service.find).toBeCalledWith(123);
      expect(resultCliente).toEqual(undefined);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
    });
  });
});
