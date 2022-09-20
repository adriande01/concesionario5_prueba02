import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ClienteDetailComponent } from './cliente-detail.component';

describe('Cliente Management Detail Component', () => {
  let comp: ClienteDetailComponent;
  let fixture: ComponentFixture<ClienteDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClienteDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ cliente: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(ClienteDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(ClienteDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load cliente on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.cliente).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
