import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtualizacaoPessoa } from './atualizacao-pessoa';

describe('AtualizacaoPessoa', () => {
  let component: AtualizacaoPessoa;
  let fixture: ComponentFixture<AtualizacaoPessoa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtualizacaoPessoa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtualizacaoPessoa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
