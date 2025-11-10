import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizacaoLivro } from './atualizacao-livro';

describe('AtualizacaoLivro', () => {
  let component: AtualizacaoLivro;
  let fixture: ComponentFixture<AtualizacaoLivro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtualizacaoLivro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtualizacaoLivro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
