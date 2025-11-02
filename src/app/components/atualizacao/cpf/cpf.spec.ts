import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cpf } from './cpf';

describe('Cpf', () => {
  let component: Cpf;
  let fixture: ComponentFixture<Cpf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cpf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cpf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
