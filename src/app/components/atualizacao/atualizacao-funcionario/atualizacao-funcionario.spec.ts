import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizacaoFuncionario } from './atualizacao-funcionario';

describe('AtualizacaoFuncionario', () => {
  let component: AtualizacaoFuncionario;
  let fixture: ComponentFixture<AtualizacaoFuncionario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtualizacaoFuncionario]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtualizacaoFuncionario);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
