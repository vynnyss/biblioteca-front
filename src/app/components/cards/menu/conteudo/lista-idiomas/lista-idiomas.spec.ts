import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaIdiomas } from './lista-idiomas';

describe('ListaIdiomas', () => {
  let component: ListaIdiomas;
  let fixture: ComponentFixture<ListaIdiomas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaIdiomas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaIdiomas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
