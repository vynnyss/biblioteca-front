import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesCliente } from './detalhes-cliente';

describe('DetalhesCliente', () => {
  let component: DetalhesCliente;
  let fixture: ComponentFixture<DetalhesCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
