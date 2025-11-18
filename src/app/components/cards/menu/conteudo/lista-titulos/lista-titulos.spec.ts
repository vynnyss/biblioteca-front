import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaTitulos } from './lista-titulos';

describe('ListaTitulos', () => {
  let component: ListaTitulos;
  let fixture: ComponentFixture<ListaTitulos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaTitulos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaTitulos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
