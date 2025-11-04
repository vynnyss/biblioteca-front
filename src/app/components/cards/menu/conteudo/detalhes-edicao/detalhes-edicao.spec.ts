import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalhesEdicao } from './detalhes-edicao';

describe('DetalhesEdicao', () => {
  let component: DetalhesEdicao;
  let fixture: ComponentFixture<DetalhesEdicao>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalhesEdicao]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalhesEdicao);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
