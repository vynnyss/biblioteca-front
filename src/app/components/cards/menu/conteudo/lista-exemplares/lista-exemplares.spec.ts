import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaExemplares } from './lista-exemplares';

describe('ListaExemplares', () => {
  let component: ListaExemplares;
  let fixture: ComponentFixture<ListaExemplares>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaExemplares]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaExemplares);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
