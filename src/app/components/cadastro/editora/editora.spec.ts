import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Editora } from './editora';

describe('Editora', () => {
  let component: Editora;
  let fixture: ComponentFixture<Editora>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Editora]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Editora);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
