import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VendedorFormService } from './vendedor-form.service';
import { VendedorService } from '../service/vendedor.service';
import { IVendedor } from '../vendedor.model';

import { VendedorUpdateComponent } from './vendedor-update.component';

describe('Vendedor Management Update Component', () => {
  let comp: VendedorUpdateComponent;
  let fixture: ComponentFixture<VendedorUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let vendedorFormService: VendedorFormService;
  let vendedorService: VendedorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VendedorUpdateComponent],
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
      .overrideTemplate(VendedorUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VendedorUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    vendedorFormService = TestBed.inject(VendedorFormService);
    vendedorService = TestBed.inject(VendedorService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const vendedor: IVendedor = { id: 456 };

      activatedRoute.data = of({ vendedor });
      comp.ngOnInit();

      expect(comp.vendedor).toEqual(vendedor);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVendedor>>();
      const vendedor = { id: 123 };
      jest.spyOn(vendedorFormService, 'getVendedor').mockReturnValue(vendedor);
      jest.spyOn(vendedorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vendedor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vendedor }));
      saveSubject.complete();

      // THEN
      expect(vendedorFormService.getVendedor).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(vendedorService.update).toHaveBeenCalledWith(expect.objectContaining(vendedor));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVendedor>>();
      const vendedor = { id: 123 };
      jest.spyOn(vendedorFormService, 'getVendedor').mockReturnValue({ id: null });
      jest.spyOn(vendedorService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vendedor: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: vendedor }));
      saveSubject.complete();

      // THEN
      expect(vendedorFormService.getVendedor).toHaveBeenCalled();
      expect(vendedorService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVendedor>>();
      const vendedor = { id: 123 };
      jest.spyOn(vendedorService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ vendedor });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(vendedorService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
