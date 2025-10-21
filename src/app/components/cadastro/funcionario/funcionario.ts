import { Component } from '@angular/core';

@Component({
  selector: 'app-funcionario',
  imports: [],
  templateUrl: './funcionario.html',
  styleUrl: './funcionario.css'
})
export class Funcionario {

  mascaraCPF(event: any): void {
  const input = event.target;
  let valor = input.value;

  
  const posInicial = input.selectionStart;

  
  valor = valor.replace(/\D/g, '');

  
  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

 
  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }

  
  input.value = valor;
  input.setSelectionRange(posInicial, posInicial);
}

  cancelar() {
    console.log('Ação de cancelar executada');
  }
}


