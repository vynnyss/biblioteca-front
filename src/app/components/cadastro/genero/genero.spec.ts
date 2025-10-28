import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Genero } from './genero';

describe('Genero Component', () => {
  let component: Genero;
  let fixture: ComponentFixture<Genero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Genero] 
    }).compileComponents();

    fixture = TestBed.createComponent(Genero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
