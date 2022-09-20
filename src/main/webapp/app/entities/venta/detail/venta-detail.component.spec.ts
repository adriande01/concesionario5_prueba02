import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VentaDetailComponent } from './venta-detail.component';

describe('Venta Management Detail Component', () => {
  let comp: VentaDetailComponent;
  let fixture: ComponentFixture<VentaDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VentaDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ venta: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VentaDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VentaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load venta on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.venta).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
