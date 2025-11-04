import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaEditoras } from './lista-editoras';

describe('ListaEditoras', () => {
  let component: ListaEditoras;
  let fixture: ComponentFixture<ListaEditoras>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaEditoras]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListaEditoras);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
