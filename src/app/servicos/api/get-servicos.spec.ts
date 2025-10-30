import { TestBed } from '@angular/core/testing';

import { GetServicos } from './get-servicos';

describe('GetServicos', () => {
  let service: GetServicos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetServicos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
