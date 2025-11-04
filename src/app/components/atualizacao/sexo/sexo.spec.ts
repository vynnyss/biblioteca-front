import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sexo } from './sexo';

describe('Sexo', () => {
  let component: Sexo;
  let fixture: ComponentFixture<Sexo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sexo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sexo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
