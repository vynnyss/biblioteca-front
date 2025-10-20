import { Component } from '@angular/core';

@Component({
  selector: 'app-pessoa',
  templateUrl: './pessoa.html',
  styleUrls: ['./pessoa.css']
})
export class Pessoa {

mascaraCPF(event: any): void {
  const input = event.target;
  let valor = input.value;

  // Posição atual do cursor
  const posInicial = input.selectionStart;

  // Remove tudo que não for número
  valor = valor.replace(/\D/g, '');

  // Limita a 11 dígitos
  if (valor.length > 11) {
    valor = valor.slice(0, 11);
  }

  // Aplica a máscara
  if (valor.length > 9) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
  } else if (valor.length > 6) {
    valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
  } else if (valor.length > 3) {
    valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
  }

  // Atualiza o valor e reposiciona o cursor
  input.value = valor;
  input.setSelectionRange(posInicial, posInicial);
}

  cancelar() {
    console.log('Ação de cancelar executada');
  }
}
