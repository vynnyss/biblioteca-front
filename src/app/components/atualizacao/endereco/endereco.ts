import { Component } from '@angular/core';

@Component({
  selector: 'app-endereco',
  imports: [],
  templateUrl: './endereco.html',
  styleUrls: ['./endereco.css']
})
export class Endereco {

  cancelar(): void {
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back();
    }
  }

}
