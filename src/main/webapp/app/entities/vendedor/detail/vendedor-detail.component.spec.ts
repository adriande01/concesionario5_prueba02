import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VendedorDetailComponent } from './vendedor-detail.component';

describe('Vendedor Management Detail Component', () => {
  let comp: VendedorDetailComponent;
  let fixture: ComponentFixture<VendedorDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendedorDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ vendedor: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(VendedorDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(VendedorDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load vendedor on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.vendedor).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
