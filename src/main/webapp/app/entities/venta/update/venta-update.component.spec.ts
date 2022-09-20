import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VentaFormService } from './venta-form.service';
import { VentaService } from '../service/venta.service';
import { IVenta } from '../venta.model';
import { IVehiculo } from 'app/entities/vehiculo/vehiculo.model';
import { VehiculoService } from 'app/entities/vehiculo/service/vehiculo.service';
import { ICliente } from 'app/entities/cliente/cliente.model';
import { ClienteService } from 'app/entities/cliente/service/cliente.service';
import { IVendedor } from 'app/entities/vendedor/vendedor.model';
import { VendedorService } from 'app/entities/vendedor/service/vendedor.service';

import { VentaUpdateComponent } from './venta-update.component';

describe('Venta Management Update Component', () => {
  let comp: VentaUpdateComponent;
  let fixture: ComponentFixture<VentaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let ventaFormService: VentaFormService;
  let ventaService: VentaService;
  let vehiculoService: VehiculoService;
  let clienteService: ClienteService;
  let vendedorService: VendedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VentaUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(VentaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VentaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    ventaFormService = TestBed.inject(VentaFormService);
    ventaService = TestBed.inject(VentaService);
    vehiculoService = TestBed.inject(VehiculoService);
    clienteService = TestBed.inject(ClienteService);
    vendedorService = TestBed.inject(VendedorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call vehiculo query and add missing value', () => {
      const venta: IVenta = { id: 456 };
      const vehiculo: IVehiculo = { id: 50109 };
      venta.vehiculo = vehiculo;

      const vehiculoCollection: IVehiculo[] = [{ id: 7802 }];
      jest.spyOn(vehiculoService, 'query').mockReturnValue(of(new HttpResponse({ body: vehiculoCollection })));
      const expectedCollection: IVehiculo[] = [vehiculo, ...vehiculoCollection];
      jest.spyOn(vehiculoService, 'addVehiculoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ venta });
      comp.ngOnInit();

      expect(vehiculoService.query).toHaveBeenCalled();
      expect(vehiculoService.addVehiculoToCollectionIfMissing).toHaveBeenCalledWith(vehiculoCollection, vehiculo);
      expect(comp.vehiculosCollection).toEqual(expectedCollection);
    });

    it('Should call Cliente query and add missing value', () => {
      const venta: IVenta = { id: 456 };
      const cliente: ICliente = { id: 97527 };
      venta.cliente = cliente;

      const clienteCollection: ICliente[] = [{ id: 58807 }];
      jest.spyOn(clienteService, 'query').mockReturnValue(of(new HttpResponse({ body: clienteCollection })));
      const additionalClientes = [cliente];
      const expectedCollection: ICliente[] = [...additionalClientes, ...clienteCollection];
      jest.spyOn(clienteService, 'addClienteToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ venta });
      comp.ngOnInit();

      expect(clienteService.query).toHaveBeenCalled();
      expect(clienteService.addClienteToCollectionIfMissing).toHaveBeenCalledWith(
        clienteCollection,
        ...additionalClientes.map(expect.objectContaining)
      );
      expect(comp.clientesSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Vendedor query and add missing value', () => {
      const venta: IVenta = { id: 456 };
      const vendedor: IVendedor = { id: 68935 };
      venta.vendedor = vendedor;

      const vendedorCollection: IVendedor[] = [{ id: 59639 }];
      jest.spyOn(vendedorService, 'query').mockReturnValue(of(new HttpResponse({ body: vendedorCollection })));
      const additionalVendedors = [vendedor];
      const expectedCollection: IVendedor[] = [...additionalVendedors, ...vendedorCollection];
      jest.spyOn(vendedorService, 'addVendedorToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ venta });
      comp.ngOnInit();

      expect(vendedorService.query).toHaveBeenCalled();
      expect(vendedorService.addVendedorToCollectionIfMissing).toHaveBeenCalledWith(
        vendedorCollection,
        ...additionalVendedors.map(expect.objectContaining)
      );
      expect(comp.vendedorsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const venta: IVenta = { id: 456 };
      const vehiculo: IVehiculo = { id: 15949 };
      venta.vehiculo = vehiculo;
      const cliente: ICliente = { id: 11625 };
      venta.cliente = cliente;
      const vendedor: IVendedor = { id: 92428 };
      venta.vendedor = vendedor;

      activatedRoute.data = of({ venta });
      comp.ngOnInit();

      expect(comp.vehiculosCollection).toContain(vehiculo);
      expect(comp.clientesSharedCollection).toContain(cliente);
      expect(comp.vendedorsSharedCollection).toContain(vendedor);
      expect(comp.venta).toEqual(venta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVenta>>();
      const venta = { id: 123 };
      jest.spyOn(ventaFormService, 'getVenta').mockReturnValue(venta);
      jest.spyOn(ventaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ venta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: venta }));
      saveSubject.complete();

      // THEN
      expect(ventaFormService.getVenta).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(ventaService.update).toHaveBeenCalledWith(expect.objectContaining(venta));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVenta>>();
      const venta = { id: 123 };
      jest.spyOn(ventaFormService, 'getVenta').mockReturnValue({ id: null });
      jest.spyOn(ventaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ venta: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: venta }));
      saveSubject.complete();

      // THEN
      expect(ventaFormService.getVenta).toHaveBeenCalled();
      expect(ventaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVenta>>();
      const venta = { id: 123 };
      jest.spyOn(ventaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ venta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(ventaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareVehiculo', () => {
      it('Should forward to vehiculoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vehiculoService, 'compareVehiculo');
        comp.compareVehiculo(entity, entity2);
        expect(vehiculoService.compareVehiculo).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareCliente', () => {
      it('Should forward to clienteService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(clienteService, 'compareCliente');
        comp.compareCliente(entity, entity2);
        expect(clienteService.compareCliente).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareVendedor', () => {
      it('Should forward to vendedorService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(vendedorService, 'compareVendedor');
        comp.compareVendedor(entity, entity2);
        expect(vendedorService.compareVendedor).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
