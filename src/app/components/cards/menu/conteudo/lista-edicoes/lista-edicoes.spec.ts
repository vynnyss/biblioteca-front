import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEdicoes } from './lista-edicoes';

describe('ListaEdicoes', () => {
  let component: ListaEdicoes;
  let fixture: ComponentFixture<ListaEdicoes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEdicoes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEdicoes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
