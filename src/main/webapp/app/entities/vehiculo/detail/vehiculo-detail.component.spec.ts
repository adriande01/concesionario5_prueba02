import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VehiculoDetailComponent } from './vehiculo-detail.component';

describe('Vehiculo Management Detail Component', () => {
  let comp: VehiculoDetailComponent;
  let fixture: ComponentFixture<VehiculoDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VehiculoDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ vehiculo: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VehiculoDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VehiculoDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load vehiculo on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.vehiculo).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
