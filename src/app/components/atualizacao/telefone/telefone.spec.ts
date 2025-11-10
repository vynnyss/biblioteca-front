import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Telefone } from './telefone';

describe('Telefone', () => {
  let component: Telefone;
  let fixture: ComponentFixture<Telefone>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Telefone]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Telefone);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
