import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaAutores } from './lista-autores';

describe('ListaAutores', () => {
  let component: ListaAutores;
  let fixture: ComponentFixture<ListaAutores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaAutores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaAutores);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
