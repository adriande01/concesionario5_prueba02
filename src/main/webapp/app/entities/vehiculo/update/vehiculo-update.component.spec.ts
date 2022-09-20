import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VehiculoFormService } from './vehiculo-form.service';
import { VehiculoService } from '../service/vehiculo.service';
import { IVehiculo } from '../vehiculo.model';

import { VehiculoUpdateComponent } from './vehiculo-update.component';

describe('Vehiculo Management Update Component', () => {
  let comp: VehiculoUpdateComponent;
  let fixture: ComponentFixture<VehiculoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vehiculoFormService: VehiculoFormService;
  let vehiculoService: VehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VehiculoUpdateComponent],
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
      .overrideTemplate(VehiculoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VehiculoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vehiculoFormService = TestBed.inject(VehiculoFormService);
    vehiculoService = TestBed.inject(VehiculoService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vehiculo: IVehiculo = { id: 456 };

      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      expect(comp.vehiculo).toEqual(vehiculo);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehiculo>>();
      const vehiculo = { id: 123 };
      jest.spyOn(vehiculoFormService, 'getVehiculo').mockReturnValue(vehiculo);
      jest.spyOn(vehiculoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehiculo }));
      saveSubject.complete();

      // THEN
      expect(vehiculoFormService.getVehiculo).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vehiculoService.update).toHaveBeenCalledWith(expect.objectContaining(vehiculo));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehiculo>>();
      const vehiculo = { id: 123 };
      jest.spyOn(vehiculoFormService, 'getVehiculo').mockReturnValue({ id: null });
      jest.spyOn(vehiculoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehiculo: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vehiculo }));
      saveSubject.complete();

      // THEN
      expect(vehiculoFormService.getVehiculo).toHaveBeenCalled();
      expect(vehiculoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVehiculo>>();
      const vehiculo = { id: 123 };
      jest.spyOn(vehiculoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vehiculo });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vehiculoService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
