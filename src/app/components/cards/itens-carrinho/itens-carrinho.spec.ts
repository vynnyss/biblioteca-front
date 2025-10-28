import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensCarrinho } from './itens-carrinho';

describe('ItensCarrinho', () => {
  let component: ItensCarrinho;
  let fixture: ComponentFixture<ItensCarrinho>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItensCarrinho]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensCarrinho);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
