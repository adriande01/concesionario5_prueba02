import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ClienteFormService } from './cliente-form.service';
import { ClienteService } from '../service/cliente.service';
import { ICliente } from '../cliente.model';

import { ClienteUpdateComponent } from './cliente-update.component';

describe('Cliente Management Update Component', () => {
  let comp: ClienteUpdateComponent;
  let fixture: ComponentFixture<ClienteUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let clienteFormService: ClienteFormService;
  let clienteService: ClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ClienteUpdateComponent],
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
      .overrideTemplate(ClienteUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClienteUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    clienteFormService = TestBed.inject(ClienteFormService);
    clienteService = TestBed.inject(ClienteService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const cliente: ICliente = { id: 456 };

      activatedRoute.data = of({ cliente });
      comp.ngOnInit();

      expect(comp.cliente).toEqual(cliente);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICliente>>();
      const cliente = { id: 123 };
      jest.spyOn(clienteFormService, 'getCliente').mockReturnValue(cliente);
      jest.spyOn(clienteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cliente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cliente }));
      saveSubject.complete();

      // THEN
      expect(clienteFormService.getCliente).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(clienteService.update).toHaveBeenCalledWith(expect.objectContaining(cliente));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICliente>>();
      const cliente = { id: 123 };
      jest.spyOn(clienteFormService, 'getCliente').mockReturnValue({ id: null });
      jest.spyOn(clienteService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cliente: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: cliente }));
      saveSubject.complete();

      // THEN
      expect(clienteFormService.getCliente).toHaveBeenCalled();
      expect(clienteService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICliente>>();
      const cliente = { id: 123 };
      jest.spyOn(clienteService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ cliente });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(clienteService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});
