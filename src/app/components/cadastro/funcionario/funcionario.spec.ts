import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Funcionario } from './funcionario';

describe('Funcionario', () => {
  let component: Funcionario;
  let fixture: ComponentFixture<Funcionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Funcionario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Funcionario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
