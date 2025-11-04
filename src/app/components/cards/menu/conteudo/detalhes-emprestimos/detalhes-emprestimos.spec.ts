import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEmprestimos } from './detalhes-emprestimos';

describe('DetalhesEmprestimos', () => {
  let component: DetalhesEmprestimos;
  let fixture: ComponentFixture<DetalhesEmprestimos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesEmprestimos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesEmprestimos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
