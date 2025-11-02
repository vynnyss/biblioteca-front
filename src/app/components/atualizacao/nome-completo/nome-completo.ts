import { Component } from '@angular/core';

@Component({
  selector: 'app-nome-completo',
  imports: [],
  templateUrl: './nome-completo.html',
  styleUrls: ['./nome-completo.css']
})
export class NomeCompleto {

  cancelar(): void {
  
    if (typeof window !== 'undefined' && window.history && window.history.length > 0) {
      window.history.back();
    }
  }

}
