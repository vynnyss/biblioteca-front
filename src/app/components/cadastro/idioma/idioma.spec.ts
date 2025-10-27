import { ComponentFixture, TestBed } from '@angular/core/testing';
import {Idioma} from './idioma';

describe('Idioma Component' , () => {
  let component: Idioma;
  let fixture: ComponentFixture<Idioma>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Idioma]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Idioma);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
